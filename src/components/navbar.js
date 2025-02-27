'use client'
import React, { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className=" w-full border-b border-gray-200 ">
        <div className="shadow-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="px-8 sm:px-10 md:px-12 lg:px-16 flex-shrink-0">
              <h1 className="text-2xl">
                <span className="text-black">Any</span>
                <span className="text-yellow-500">Code</span>
              </h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-10">
              <NavigationMenu className="">
                <NavigationMenuList className="flex items-center justify-center space-x-10 ">
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                        Services
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                        About Us
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="">
                      <Button variant="secondary">
                       Sign Up/Login
                      </Button>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Sheet Menu & Sign Up Button */}
            <div className="flex items-center md:hidden ">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="mr-2">
                    <svg
                      className="w-6 h-6 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                      ></path>
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent className="">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <NavigationMenu className="px-[60px] py-2">
                    <NavigationMenuList className="flex flex-col space-y-2 ">
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                            Home
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                            Services
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className="text-sm text-black hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                            About Us
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className="">
                            <Button variant="outline">
                              sign up
                          </Button>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </SheetContent>
              </Sheet>
              <span className="text-black border rounded-2xl pb-2 pt-1 pl-2 pr-2 hidden md:inline-block">
                sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

