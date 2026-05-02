"use client";

import { USER_ROLE } from "@/constant/role";
import {
  getUserInfo,
  isLoggedIn,
} from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { Layout } from "antd";
import Sidebar from "@/components/ui/Sidebar";
import Contents from "@/components/ui/Contents";
import { Content } from "antd/es/layout/layout";

const DashboardLayoutSuperAdmin = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
    if (role !== USER_ROLE.ADMIN) {
      router.push("/error");
    }
    setIsLoading(true);
  }, [userLoggedIn, router]);

  if (!isLoading) {
    return <Loading />;
  }

 return (
  <Layout style={{ height: "100vh" }}>
    <Sidebar />

    <Layout style={{ height: "100%", backgroundColor: "white" }}>
      <Content
        style={{
          height: "100%",
          overflowY: "auto",
          backgroundColor: "white",
        }}
      >
        {children}
      </Content>
    </Layout>
  </Layout>
);
};

export default DashboardLayoutSuperAdmin;
