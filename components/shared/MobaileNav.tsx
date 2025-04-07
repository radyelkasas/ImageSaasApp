"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobaileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="Logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex items-center gap-4 md:gap-8">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger className="transition-transform hover:scale-110 active:scale-95">
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-80" side="right">
              <>
                {/* Logo in mobile menu */}
                <div className="flex justify-between items-center">
                  <Image
                    src="/assets/images/logo-text.svg"
                    alt="Logo"
                    width={152}
                    height={23}
                  />
                </div>
                
                {/* Divider */}
                <div className="h-px w-full bg-sidebar-border my-4"></div>

                {/* Navigation links */}
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;
                    return (
                      <li
                        key={link.route}
                        className={`sidebar-nav-item ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <Link className="sideba-link cursor-pointer" href={link.route}>
                          <Image
                            src={link.icon}
                            alt={link.label}
                            width={24}
                            height={24}
                            className={`${isActive ? "brightness-200" : ""}`}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button className="bg-primary hover:bg-primary/90 transition-colors">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobaileNav;