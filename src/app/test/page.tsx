"use client";
import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        className="z-50"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
        }}
        onCollapse={(collapsed, type) => {

        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>

      <div className="fixed" style={{ margin: "24px 16px 0" }}>
        <div className="w-full">
          content
          skjdhfvdkjlxhbkdlfnhg;lbf;lkgj;lfdjh;lf;lhjfvldkfh;lbhdlsfhlkjdhb;klfhdlkghdlkhgk;lfhdlkghldkfjhjlkfjdlkfhsdkjn
        </div>
      </div>
    </Layout>
  );
};

export default App;
