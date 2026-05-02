"use client";

import Image from "next/image";
// import backgroundImage from "../../assets/backgroundImg.jpg";
import Link from "next/link";

const HomeHeader = () => {
  return (
    <div
      className="flex flex-col-reverse h-screen lg:flex-row lg:justify-around items-center py-5 lg:h-screen"
      style={{
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
      }}
    >
      <div className="my-auto text-center lg:text-start">
        <h1 className="text-white font-thin text-2xl lg:text-7xl mb-3">
          zhoopzhoop <br />
        </h1>
        <Link href="/common">
          <button
            className="btn text-yellow-400 border-blue-700"
            style={{
              background:
                "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
            }}
          >
            Start Journey
          </button>
        </Link>
      </div>
      <div className="flex justify-center px-20 lg-px-0 lg:block sm: mb-3">
        {/* <Image src={backgroundImage} layout="responsive" alt="login image" /> */}
      </div>
    </div>
  );
};

export default HomeHeader;
