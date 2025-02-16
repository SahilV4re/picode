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

const Navbar = () => {
    return (
        <>
        
        
      <div className="sticky w-full  bg-gradient-to-b from-[#641478] to-[#23152c] border-b border-gray-200 pl-7">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex items-center h-16">
            
            <div className="flex-shrink-0 mr-16">
              <h1 className="text-2xl">
                <span className="text-white">Any</span>
                <span className="text-yellow-400">Code</span>
              </h1>
            </div>

            {/* Navigation */}
            <NavigationMenu className="">
              <NavigationMenuList className="flex items-center justify-center space-x-10">
              <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/users" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      Services
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/researchpanel" legacyBehavior passHref>
                    <NavigationMenuLink className="text-sm text-white hover:text-yellow-600 hover:bg-white/10 px-3 py-2 rounded-md transition-colors duration-200">
                      About Us 
                      
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
        
        </>
    );
};
export default Navbar;