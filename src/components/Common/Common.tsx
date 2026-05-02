'use client'
import { getUserInfo } from "@/services/auth.service";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";
import HomeImage from "@/assets/backgroundImg.jpg";
const Common = () => {
  const { role } = getUserInfo() as any;

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HomeImage}
          alt="Background"
          placeholder="blur"
          fill
          className="object-cover"
        />
        {/* Optional overlay for dark effect */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Card Content */}
      
<div className="z-10 rounded-2xl  p-8 w-full max-w-md text-center text-white ">
  {/* Animated Welcome Message */}
  
  {/* <TypeAnimation
        sequence={[
          '', 
          2000,"",200                    
        ]}
        wrapper="h1"
        cursor={true}
        repeat={Infinity}
        className="text-5xl w-full leading-tight font-bold mb-4 text-purple-300 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
      /> */}
      <h1 className="text-5xl w-full leading-tight font-bold mb-4 text-purple-300 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">Welcome to ZHOOPZHOOP</h1>

  {/* Eye-catching subtitle */}
  <p className="text-sm text-purple-200 italic animate-fade-in">
    Your gateway to a seamless experience 🚀
  </p>
</div>


    </div>
  );
};

export default Common;
