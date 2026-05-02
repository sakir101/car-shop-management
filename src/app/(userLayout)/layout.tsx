"use client";

import Contents from "../../components/ui/Contents";
import Sidebar from "@/components/ui/Sidebar";
import {
  getUserInfo,
  isLoggedIn,
  userVerificationCheck,
} from "@/services/auth.service";
import { Layout } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { USER_ROLE } from "@/constant/role";
import { Secret } from "jsonwebtoken";

const DashboardLayoutUser = ({ children }: { children: React.ReactNode }) => {
  const userLoggedIn = isLoggedIn();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userLoggedIn) {
      router.push("/login");
    }

    const { role, exp } = getUserInfo() as any;
    if (!(exp * 1000 > Date.now())) {
      router.push("/login");
    }

    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_USER;
    const verifyToken = userVerificationCheck(secretKey as Secret);

    if (role !== USER_ROLE.TECHNICIAN || verifyToken === null) {
      router.push("/error");
    }

    setIsLoading(true);
  }, [userLoggedIn, router]);

  if (!isLoading) {
    return <Loading />;
  }

  return (
    <Layout hasSider>
      <Sidebar />
      <Contents>{children}</Contents>
    </Layout>
  );
};

export default DashboardLayoutUser;
