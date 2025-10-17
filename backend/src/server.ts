import express, { NextFunction, Request, Response } from "express";
import { db } from "./db";
import { records, users } from "./db/schema";
import { recordsSeedData, usersSeedData } from "./libs/seedData";
import { Record, RecordWithUsername, User, UserWithoutPassword, AuthenticatedRequest, NewUser } from "./libs/definitions";
import { eq, gte, sql } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt, { Jwt, JwtPayload, VerifyCallback, VerifyErrors } from 'jsonwebtoken';

const PORT = 4000;

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const secret = process.env.JWT_SECRET ?? '';

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
    if (err) return res.sendStatus(403);
    if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
      req.userId = decoded.userId as number;
    }
    next();
  });
};

app.get("/seed", async (req, res) => {
  try {
    const [adminsCount] = await
      db
        .select({ count: sql<number>`count(*)`})
        .from(users)
        .where(eq(users.role, 'admin'));

    if (adminsCount.count !== 0) return res
        .status(403)
        .json({ message: "Database already seeded", status: 403 });

    const usersData: Array<NewUser> = await Promise.all(
      usersSeedData.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    await db.transaction(async (tx) => {
      await tx.insert(users).values(usersData);
      await tx.insert(records).values(recordsSeedData);
    });

    res.status(201).json({ message: "Database seeded successfully", status: 201});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error seeding database", status: 500});
  };
});

app.get("/get_logged_user", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user: UserWithoutPassword = (await
      db
        .select({
          id: users.id,
          username: users.username,
          role: users.role
        })
        .from(users)
        .where(eq(users.id, req.userId)))[0];

    if (!user) return res.status(401).json({ message: "User not found", status: 401 });

    return res.status(200).json({ data: user, status: 200 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/users", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit)) || 10;
    const offset = parseInt(String(req.query.offset)) || 0;

    const allUsers: Array<UserWithoutPassword> = await
      db
        .select({
          id: users.id,
          username: users.username,
          role: users.role
        })
        .from(users)
        .limit(limit)
        .offset(offset);

    res.status(200).json({ data: allUsers, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.get("/users/count", async (req, res) => {
  try {
    const result = await
      db
        .select({ count: sql`count(*)`})
        .from(users);

    const total = result[0]?.count ?? 0;

    res.status(200).json({ count: total, status: 200});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    await db.insert(users).values({ username, password });
    res.status(201).json({ message: 'ok', status: 201});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  };
});

app.put("/users", async (req, res) => {
  const { id, username, password }: { id: number, username: string, password: string} = req.body;

  try {
    const hashed_password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    await db
      .update(users)
      .set(password.length > 0 ? { username: username, password: hashed_password } : { username: username })
      .where(eq(users.id, id));

    res.status(201).json({ message: 'ok', status: 201 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Database error", status: 500});
  }
});

app.delete("/users", async (req, res) => {
  const { id } = req.body;

  try {
    await db
      .delete(users)
      .where(eq(users.id, id));

    res.status(200).json({ message: 'ok', status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user_row: User = (await db.select().from(users).where(eq(users.username, username)))[0];

    if (!user_row) {
      return res.status(401).json({ message: "User does not exist", status: 401 });
    }

    const password_match: boolean = await bcrypt.compare(password, user_row.password);

    if (!password_match) {
      return res.status(401).json({ message: "Invalid credentials", status: 401 });
    }

    const token = jwt.sign(
      { userId: user_row.id },
      secret,
      { expiresIn: '4h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .status(200)
    .json({
      user: {
        id: user_row.id,
        username: user_row.username,
        role: user_row.role
      },
      status: 200
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let inserted_user: User | null = null;

  try {
    const hashed_password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

    const user: NewUser = {
      username: username,
      password: hashed_password,
      role: 'user'
    };

    const result = (await db.insert(users).values(user).$returningId())[0];
    inserted_user = (await db.select().from(users).where(eq(users.id, result.id)))[0];
  } catch (error) {
    return res.status(500).json({ message: "Database error", status: 500 });
  } finally {
    const token = jwt.sign(
      { userId: inserted_user?.id },
      secret,
      { expiresIn: '4h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    .status(201)
    .json({
      user: {
        id: inserted_user?.id,
        username: inserted_user?.username,
        role: inserted_user?.role
      },
      status: 201
    })
  }
})

app.get("/logout", authenticate, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.status(200).json({ message: 'ok', status: 200 });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await db.insert(users).values({ username: username, password: hashed });
    res.status(201).json({ message: 'ok', status: 201 });
  } catch (error) {
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.get("/records", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit)) || 10;
    const offset = parseInt(String(req.query.offset)) || 0;

    const allRecords: Array<RecordWithUsername> = await
      db
        .select({
          id: records.id,
          temperature: records.temperature,
          username: users.username,
          uploaded_at: records.uploaded_at
        })
        .from(records)
        .innerJoin(users, eq(users.id, records.uploaded_by))
        .limit(limit)
        .offset(offset);

    res.status(200).json({ data: allRecords, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.get("/records/count", async (req, res) => {
  try {
    const result = await
      db
        .select({ count: sql`count(*)`})
        .from(records);

    const total = result[0]?.count ?? 0;

    res.status(200).json({ count: total, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/count/:userid", async (req, res) => {
  try {
    const result = await
      db
        .select({ count: sql`count(*)`})
        .from(records)
        .where(eq(records.uploaded_by, Number(req.params.userid)));

    const total = result[0]?.count ?? 0;

    res.status(200).json({ count: total, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.post("/records", async (req, res) => {
  const { temperature, uploaded_by } = req.body;

  try {
    await db.insert(records).values({ temperature, uploaded_by: uploaded_by });
    res.status(201).json({ message: 'ok', status: 201});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.put("/records", async (req, res) => {
  const { id, temperature } = req.body;

  try {
    await db
      .update(records)
      .set({ temperature: temperature })
      .where(eq(records.id, id));

    res.status(201).json({ message: 'ok', status: 201 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
});

app.delete("/records", async (req, res) => {
  const { id } = req.body;

  try {
    await db
      .delete(records)
      .where(eq(records.id, id));

    res.status(200).json({ message: 'ok', status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500});
  }
});

app.get("/records/avg", async (req, res) => {
  try {
    const result = await
      db
        .select({ avg: sql`truncate(avg(temperature), 2)` })
        .from(records);

    const avg = result[0]?.avg ?? 0;

    res.status(200).json({ avg: avg, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/avg/:days", async (req, res) => {
  try {
    const result = await
      db
        .select({ avg: sql`truncate(avg(temperature), 2)` })
        .from(records)
        .where(gte(records.uploaded_at, sql`date_sub(now(), interval ${req.params.days} day)`));

    const avg = result[0]?.avg ?? 0;

    res.status(200).json({ avg: avg, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/max", async (req, res) => {
  try {
    const result = await
      db
        .select({ max: sql`truncate(max(temperature), 2)`})
        .from(records);

    const max = result[0]?.max ?? 0;

    res.status(200).json({ max: max, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/max/:days", async (req, res) => {
  try {
    const result = await
      db
        .select({ max: sql`truncate(max(temperature), 2)` })
        .from(records)
        .where(gte(records.uploaded_at, sql`date_sub(now(), interval ${req.params.days} day)`));

    const max = result[0]?.max ?? 0;

    res.status(200).json({ max: max, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/min", async (req, res) => {
  try {
    const result = await
      db
        .select({ min: sql`truncate(min(temperature), 2)`})
        .from(records);

    const min = result[0]?.min ?? 0;

    res.status(200).json({ min: min, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.get("/records/min/:days", async (req, res) => {
  try {
    const result = await
      db
        .select({ min: sql`truncate(min(temperature), 2)` })
        .from(records)
        .where(gte(records.uploaded_at, sql`date_sub(now(), interval ${req.params.days} day)`));

    const min = result[0]?.min ?? 0;

    res.status(200).json({ min: min, status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error", status: 500 });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
