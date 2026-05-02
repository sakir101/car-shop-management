"use client";

import { Avatar, Button, Dropdown, Layout, Row, Space } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { removeUserInfo } from "@/services/auth.service";
import { authKey, estimateCreate,selectedMenuKey,sidebarCollapsed, createGeneralItem, createAppoinment, createConcern, createContact, LogOutUser, valueEditSearch, valueMainSearch, calendarView, createinspectionGroup, formValues_signupUser, formValues_loginUser, formValues_updateService } from "@/constant/storageKey";
import { useRouter } from "next/navigation";

const { Header: AntHeader } = Layout;

const Header = () => {
  const router = useRouter();
  const logOut = () => {
    removeUserInfo(authKey);
    removeUserInfo(estimateCreate);
    removeUserInfo(selectedMenuKey);
    removeUserInfo(sidebarCollapsed);
    removeUserInfo(createGeneralItem);
    removeUserInfo(createAppoinment);
    removeUserInfo(createConcern);
    removeUserInfo(createContact);
    removeUserInfo(LogOutUser);
    removeUserInfo(valueEditSearch);
    removeUserInfo(valueMainSearch);
    removeUserInfo(valueEditSearch);
    removeUserInfo(calendarView);
    removeUserInfo(createinspectionGroup);
    removeUserInfo(formValues_signupUser);
    removeUserInfo(formValues_loginUser);
    removeUserInfo(formValues_updateService);
    router.push("/login");
  };
  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <Button onClick={logOut} type="text" danger>
          Logout
        </Button>
      ),
    },
  ];
  return (
    <AntHeader className="bg-[#E0E0E0] sticky top-0 z-50"
    >
      <Row
        justify="end"
        align="middle"
        style={{
          height: "100%",
        }}
      >
        <Dropdown menu={{ items }}>
          <a>
            <Space wrap size={16}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </Row>
    </AntHeader>
  );
};

export default Header;
