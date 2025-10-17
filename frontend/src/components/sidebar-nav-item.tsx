import { Button } from "@heroui/react";
import { Link, useLocation } from "@tanstack/react-router";
import type { ParsedLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface SidebarNavItemProps {
  icon: ReactNode;
  href: string;
  children: ReactNode;
}

export const SidebarNavItem = ({
  icon,
  href,
  children
}: SidebarNavItemProps) => {
  const location: ParsedLocation = useLocation();
  const isActive = location.href === href;

  return (
    <Button
      as={Link}
      to={href}
      variant={isActive ? "flat" : "light"}
      color={isActive ? "primary" : "default"}
      className="justify-start w-full h-10"
      startContent={icon}
    >
      <span className="text-sm">{children}</span>
    </Button>
  );
};
