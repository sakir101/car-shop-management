"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getUserInfo, removeUserInfo } from "@/services/auth.service";
import Logo from "@/assets/zhoopzhoop.png"; 
import Image from "next/image";
import {
  authKey, openKeysNew, calendarView, createAppoinment, createConcern,
  createContact, createGeneralItem, createinspectionGroup, estimateCreate,
  formValues_loginUser, formValues_signupUser, formValues_updateService,
  LogOutUser, selectedMenuKey, sidebarCollapsed, valueEditSearch,
  valueMainSearch,
  currentView
} from "@/constant/storageKey";
import { TokenStatusCheck } from "@/utils/checkTokenStatus";
export default function NavbarHome() {
  const [menuOpen, setMenuOpen] = useState(false);

const { role,exp } = getUserInfo() as any;
useEffect(() => {
  TokenStatusCheck(exp);
}, [exp]);

  return (
    <div className="bg-black bg-opacity-20 shadow-md p-4 fixed z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl no-underline font-bold text-white">
        <Image
                  src={Logo}
                  alt="Logo"
                  width={140}
                  height={40}
                  priority
                />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className=" text-white no-underline text-sm  hover:text-slate-300">Home</Link>
          {
          role&& <Link href={`/${role}/profile/account-profile`} className=" text-white no-underline text-sm  hover:text-slate-300">Dashboard</Link>
          }
          {
          !role&& <Link href="/login" className=" text-white no-underline text-sm  hover:text-slate-300">Login</Link>
          }
          
        </nav>
       
        {/* Mobile Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-md">
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-4 px-4">
          <Link className=" text-white no-underline text-sm  hover:text-slate-300" href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {
          role&& <Link href={`/${role}/profile/account-profile`} className=" text-white no-underline text-sm  hover:text-slate-300">Dashboard</Link>
          }
          <Link href="/login" className=" text-white no-underline text-sm  hover:text-slate-300">Login</Link>

        </div>
      )}
    </div>
  );
}
