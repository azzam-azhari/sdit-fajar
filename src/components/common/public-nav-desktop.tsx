"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS, type NavLinkItem } from "@/constants/navigation";

interface PublicNavDesktopProps {
  className?: string;
  links?: NavLinkItem[];
}

export function PublicNavDesktop({
  className,
  links = PUBLIC_NAV_LINKS,
}: PublicNavDesktopProps) {
  const pathname = usePathname();

  const isLinkActive = React.useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  return (
    <nav
      aria-label="Navigasi Desktop"
      className={cn("hidden lg:flex items-center gap-1 xl:gap-1.5", className)}
    >
      {links.map((item) => {
        if (item.children && item.children.length > 0) {
          const isDropdownActive =
            isLinkActive(item.href) ||
            item.children.some((child) => isLinkActive(child.href));

          return (
            <DropdownMenu key={item.href}>
              <DropdownMenuTrigger
                className={cn(
                  "group inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors outline-none",
                  "hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                  isDropdownActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.label}</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-64 p-1 rounded-lg border border-border/80 bg-popover shadow-md"
              >
                {item.children.map((child) => {
                  const isChildActive = isLinkActive(child.href);
                  return (
                    <DropdownMenuItem
                      key={child.href}
                      asChild
                      className={cn(
                        "cursor-pointer focus:bg-accent focus:text-accent-foreground p-0",
                        isChildActive && "bg-muted/70"
                      )}
                    >
                      <Link
                        href={child.href}
                        className="flex flex-col gap-0.5 rounded-md p-2 text-left text-xs transition-colors w-full"
                      >
                        <span
                          className={cn(
                            "font-medium leading-none",
                            isChildActive
                              ? "text-primary font-semibold"
                              : "text-foreground"
                          )}
                        >
                          {child.label}
                        </span>
                        {child.desc && (
                          <span className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                            {child.desc}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        const active = isLinkActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center rounded-md px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 font-semibold text-primary"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
