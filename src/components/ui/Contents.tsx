"use client";
import { Layout } from "antd";
import SABreadCrumb from "./SABreadCrumb";
import Header from "./header";
import style from "./sidebar.module.css";

const { Content } = Layout;

const Contents = ({ children }: { children: React.ReactNode }) => {
  const base = "admin";
  return (
    <Content
      className="w-full fixed lg:w-fit lg:static "
      style={{
        height: "100vh",
        color: "black",
        backgroundColor: "white",
        overflowY: "auto",
      }}
    >
      {/* <Header /> */}
      {children}
    </Content>
  );
};

export default Contents;
