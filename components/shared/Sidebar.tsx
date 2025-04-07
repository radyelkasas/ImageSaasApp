"use client";
import { navLinks } from "@/constants";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="flex justify-center lg:justify-start">
          <Image
            src="/assets/images/logo-text.svg"
            alt="Logo"
            width={180}
            height={28}
            className="logo"
          />
        </Link>
        <nav className="sidebar-nav">
          <SignedIn>
            {/* Main navigation links */}
            <ul>
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav-item ${
                      isActive ? "active" : ""
                    } group`}
                  >
                    <Link className="sideba-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={24}
                        height={24}
                        className={`${
                          isActive ? "brightness-200" : ""
                        } transition-transform group-hover:scale-110`}
                      />
                      <span className="hidden lg:block">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bottom navigation links and user button */}
            <ul>
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav-item ${
                      isActive ? "active" : ""
                    } group`}
                  >
                    <Link className="sideba-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt={link.label}
                        width={24}
                        height={24}
                        className={`${
                          isActive ? "brightness-200" : ""
                        } transition-transform group-hover:scale-110`}
                      />
                      <span className="hidden lg:block">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="mt-4 flex justify-center lg:justify-start">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="w-full mt-4">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
