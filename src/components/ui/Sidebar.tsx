'use client'
import { useState, useEffect, useMemo, useCallback } from "react";
import { Layout, Menu, Button } from "antd";
import { sidebarItems } from "@/constant/sidebarItems";
import { getUserInfo, removeUserInfo } from "@/services/auth.service";
import { UpOutlined, DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  authKey, openKeysNew, calendarView, createAppoinment, createConcern,
  createContact, createGeneralItem, createinspectionGroup, estimateCreate,
  formValues_loginUser, formValues_signupUser, formValues_updateService,
  LogOutUser, selectedMenuKey, sidebarCollapsed, valueEditSearch,
  valueMainSearch,
  currentView
} from "@/constant/storageKey";
import Image from "next/image";
import Logo from "@/assets/zhoopzhoop.png"; 
import { setRole } from "@/redux/slice/imageSlice";
import { useDispatch } from "react-redux";

const { Sider } = Layout;

const getStoredValue = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const Sidebar = () => {
  const dispatch =useDispatch()
  const { estimateType } = useAppSelector((state) => state.estimateItemShow);
  const pathname = usePathname();
  const router = useRouter();
  
  const userInfo = useMemo(() => getUserInfo() as any, []);
  const { role,exp } = userInfo;

  const [openKeys, setOpenKeys] = useState<string[]>(() => 
    getStoredValue("openKeys", [])
  );
  const [collapsed, setCollapsed] = useState<boolean>(() => 
    getStoredValue("sidebar-collapsed", false)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("openKeys", JSON.stringify(openKeys));
    }, 300);
    return () => clearTimeout(timer);
  }, [openKeys]);
  useEffect(()=>{
    dispatch(setRole(role))
  },[role,dispatch])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    }, 300);
    return () => clearTimeout(timer);
  }, [collapsed]);

  const handleCollapsed = useCallback((collapse: boolean) => {
    setCollapsed(collapse);
  }, []);

  const handleOpenChange = useCallback((keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  }, [openKeys]);

  const menuItems = useMemo(() => 
    sidebarItems(role, estimateType), 
    [role, estimateType]
  );

  const selectedKey = useMemo(() => {
    if (!menuItems) return "";
    
    let bestMatch = "";
    let maxLength = 0;
    menuItems.forEach((item) => {
      if (!item?.key) return;
      const key = item.key as string;
      if (pathname.startsWith(key) && key.length > maxLength) {
        bestMatch = key;
        maxLength = key.length;
      }
    });

    return bestMatch;
  }, [pathname, menuItems]);
  // ✅ Optimize logout function
  const logOut = useCallback(() => {
    const keysToRemove = [
      authKey, estimateCreate, selectedMenuKey, openKeysNew, sidebarCollapsed,
      createGeneralItem, createAppoinment, createConcern, createContact,
      LogOutUser, valueEditSearch, valueMainSearch, calendarView,
      createinspectionGroup, formValues_signupUser, formValues_loginUser,
      formValues_updateService,currentView
    ];
    keysToRemove.forEach(removeUserInfo);
    router.push("/login");
  }, [router]);

  return (
    <Sider
      className="z-50"
      style={{
        minHeight: "100vh",
        background: "#F9F9F9",
      }}
      breakpoint="lg"
      collapsedWidth="0"
      onCollapse={handleCollapsed}
      width={200}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* Logo / Brand */}
        <div
          style={{
            padding: collapsed ? "0.6rem 0" : "0.8rem 1rem",
            textAlign: "center",
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#333333",
            borderBottom: collapsed ? "" : "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px", 
          }}
        >
          {!collapsed && (
            <Image
              src={Logo}
              alt="Logo"
              width={140}
              height={45}
              priority
            />
          )}
        </div>

        {/* Menu */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Menu
            className="px-2"
            style={{
              background: "transparent",
              color: "#333333",
              marginTop: 8,
            }}
            selectedKeys={[selectedKey]}
            mode="inline"
            items={menuItems}
            onOpenChange={handleOpenChange}
            openKeys={openKeys}
            expandIcon={({ isOpen }) => (
              <span style={{ color: "#666666" }}>
                {isOpen ? <UpOutlined /> : <DownOutlined />}
              </span>
            )}
          />
        </div>

        {/* Logout */}
        {!collapsed && (
          <div style={{
            padding: "1rem",
            borderTop: "1px solid #f0f0f0"
          }}>
            <Button
              icon={<LogoutOutlined />}
              block
              onClick={logOut}
              style={{
                borderColor: "#d9d9d9",
                color: "#333333",
                fontWeight: "500"
              }}
              className="hover:bg-[#EFEFEF] transition-all"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </Sider>

  );
};

export default Sidebar;