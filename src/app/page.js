import { InputWithLabel } from "@/components/input";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" bg-gradient-to-b from-[#641478] to-[#23152c] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      
      
      <section className="container px-4 py-10 mx-auto lg:h-128 lg:space-x-8 lg:flex lg:items-center">
      <div className="w-full text-center lg:text-left lg:w-1/2 lg:-mt-8">
        
          <div className="flex flex-col items-center space-y-16">
        <div className="w-full text-left">
          <h1 className="text-4xl font-medium tracking tight text-yellow-400">
            India's
          </h1>
          <span className="text-4xl text-white font-medium tracking-tight">
            Simplest <span className="text-yellow-400">Pincode</span>
          </span>
          <br />
          <span className="text-4xl text-white font-medium tracking-tight">
            Lookup Tool.
          </span>
        </div>
        
      </div>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
        Effortlessly search for pin codes, explore state and district details,
          <br className="hidden lg:block" /> and access accurate post office information,
          all in one place
        </p>
        <div className="mt-6 bg-transparent border rounded-lg lg:w-2/3">
          <form
            action="https://www.creative-tim.com/twcomponents/search"
            className="flex flex-wrap justify-between md:flex-row"
          >
            <input
              type="search"
              name="query"
              placeholder="Search Pincode"
              required
              className="flex-1 h-10 px-4 m-1 text-white placeholder-gray-400 bg-transparent border-none appearance-none lg:h-12 dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-full p-2 m-1 text-white transition-colors duration-300 transform rounded-lg lg:w-12 lg:h-12 lg:p-0 bg-primary hover:bg-primary/70 focus:outline-none focus:bg-primary/70"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <div className="w-full mt-4 lg:mt-0 lg:w-1/2">
        <img
          src="https://www.creative-tim.com/twcomponents/svg/website-designer-bro-purple.svg"
          alt="tailwind css components"
          className="w-full h-full max-w-md mx-auto"
        />
      </div>
      </section>
      <div className="w-full px-4">
        <InputWithLabel/>
      </div>
      {/* <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer> */}
    </div>
  );
}
