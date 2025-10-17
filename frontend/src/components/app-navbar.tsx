import { Link as RouterLink } from "@tanstack/react-router";

import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";

export default function App() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={ RouterLink } color="foreground" to="/">
            Stats
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link as={ RouterLink } aria-current="page" to="/records">
            Records
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link as={ RouterLink } color="foreground" to="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link as={ RouterLink } to="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={ RouterLink } color="primary" to="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
