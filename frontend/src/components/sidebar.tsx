import { BarChart, Clipboard, User, Users } from "lucide-react";
import { SidebarNavItem } from "./sidebar-nav-item";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { useUser } from "@/lib/mutations/use-user";

export const Sidebar = () => {
  const user = useUser();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-divider bg-content1">
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <SidebarNavItem
              icon=<BarChart />
              href="/"
            >
              Stats
            </SidebarNavItem>

            <SidebarNavItem
              icon=<Clipboard />
              href="/records"
            >
              Records
            </SidebarNavItem>

            <SidebarNavItem
              icon=<Users />
              href="/users"
            >
              Users
            </SidebarNavItem>
          </div>
        </div>
      </nav>

      {user.data ? (
        <div className="mt-auto border-t border-divider p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{user.data?.username}</p>
              <p className="text-xs text-default-500">{user.data.role.toUpperCase()}</p>
            </div>
          </div>
        </div>
      ): (
        <div className="mt-auto p-4 flex flex-row gap-2">
          <Button
            as={Link}
            to="/login"
            variant="solid"
            color="primary"
            className="w-full"
          >
            Login
          </Button>

          <Button
            as={Link}
            to="/register"
            variant="solid"
            color="primary"
            className="w-full"
          >
            Register
          </Button>
        </div>
      )}
    </aside>
  );
};
