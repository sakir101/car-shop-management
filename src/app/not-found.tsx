"use client";

import { Row } from "antd";
import Image from "next/image";
import error from "../assets/error.png";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserInfo } from "@/services/auth.service";

const ErrorPage = () => {
  const router = useRouter();
  const { role} = getUserInfo() as any;
  useEffect(() => {
    if (role === undefined) {
      router.push("/login");
    }
  }, [role, router]);
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
        color: "red",
      }}
    >
      <Image src={error} width={500} alt="Error Image" />
    </Row>
  );
};

export default ErrorPage;
