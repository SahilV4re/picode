"use client";
import { InputWithLabel } from "@/components/input";
import AdBanner from "@/components/addbanner";

export default function Home() {
  return (
    <div className="bg-[#f4f8ff] min-h-screen pt-[20px] sm:pt-0 px-8 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      {/* Make the parent container fill the screen height */}
      <section className="flex flex-col lg:flex-row h-full items-stretch p-8 gap-8">
        
        {/* Left AdBanner (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/6 bg-black">
          <AdBanner
            className="w-full h-full"
            dataAdSlot="leftAd"
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 gap-8 justify-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-medium tracking-tight text-yellow-500 mt-0">
              India
            </h1>
            <span className="text-4xl text-black font-medium tracking-tight">
              Simplest <span className="text-yellow-500">Pincode</span> <br />
              Searching Tool.
            </span>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
              Effortlessly search for pin codes, explore state and district details,
              <br className="hidden lg:block" />
              and access accurate post office information, all in one place.
            </p>
          </div>
          
          {/* InputWithLabel taking remaining vertical space if needed */}
          <div className="mt-4">
            <InputWithLabel />
          </div>
        </div>

        {/* Right AdBanner (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-2/6 bg-black">
          <AdBanner
            className="w-full h-full"
            dataAdSlot="rightAd"
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
          />
        </div>
      </section>
    </div>
  );
}