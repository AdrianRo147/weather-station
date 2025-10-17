import { useQuery } from "@tanstack/react-query";
import type { UserWithoutPassword } from "../definitions";

async function fetchCurrentUser(): Promise<UserWithoutPassword | null> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get_logged_user`,
    { credentials: "include" }
  );

  if (res.status === 401 || res.status === 403) return null;

  if (!res.ok) throw new Error();
  const json = await res.json();
  return json.data;
}

export function useUser() {
  return useQuery<UserWithoutPassword | null>({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
