// Legacy component - react-router-dom is not installed in this Next.js app
// This file is kept for potential migration but is not currently used
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { NavLinkProps } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) => {
          const baseClass = className ?? '';
          const activeClass = isActive ? (activeClassName ?? '') : '';
          const pendingClass = isPending ? (pendingClassName ?? '') : '';
          return cn(baseClass, activeClass, pendingClass);
        }}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
