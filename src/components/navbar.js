import React from "react";
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
  } from "@/components/ui/navigation-menu"
import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <>
    
      <div className=" w-full  bg-gradient-to-b from-[#641478] to-[#23152c] border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center justify-around h-16">
            
            <div className="flex-shrink-0">
              <h1 className="text-2xl">
                <span className="text-white">Any</span>
                <span className="text-yellow-400">Code</span>
              </h1>
            </div>

            {/* Navigation */}
            <NavigationMenu className="">
              <NavigationMenuList className="flex items-center justify-center space-x-10 ">
              <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      Services
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      About Us 
                      
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
              </NavigationMenuList>
              </NavigationMenu>
              <div>
                <span className="text-white border rounded-2xl pb-2 pt-1 pl-2 pr-2 mr-3">sign up</span>
              </div>
          </div>
        </div>
      </div>
        
        </>
    );
};
export default Navbar;