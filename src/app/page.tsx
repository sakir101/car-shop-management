import Common from "@/components/Common/Common";
import HomeHeader from "@/components/Home/homeHeader";
import NavbarHome from "@/components/NavbarHome/NavbarHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZhoopZhoop App | Home",
};

export default async function Home() {
  return (
    <div
      className="h-full"
      style={{
        background:
          "linear-gradient(to right, #051937, #001b4b, #001c5f, #001b71, #0c1682)",
      }}
    >
      <NavbarHome></NavbarHome>
      <Common></Common>
    </div>
  );
}
