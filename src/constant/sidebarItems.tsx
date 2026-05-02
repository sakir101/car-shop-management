'use client'
import { MenuProps } from "antd";
import {
  UserOutlined,
  ContactsOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  ToolOutlined,
  ScheduleOutlined,
  AlertOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ApiOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import Link from "next/link";

export const sidebarItems = (role: string, estimateType?: string) => {
  const defaultSidebarItems: MenuProps["items"] = [
    {
      label: (
        <Link className="text-black" href={`/${role}/profile/account-profile`}>
          Profile
        </Link>
      ),
      icon: <UserOutlined style={{ color: "black" }} />,
      key: `/${role}/profile`,
    },
  ];

  const storeManagerItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: (
        <Link className="text-black" href={`/${role}/contact/view`}>
          Contact
        </Link>
      ),
      icon: <ContactsOutlined style={{ color: "black" }} />,
      key: `/${role}/contact`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/estimate/view`}>
          Estimate
        </Link>
      ),
      icon: <CalculatorOutlined style={{ color: "black" }} />,
      key: `/${role}/estimate`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/work-order/view`}>
          WorkOrder
        </Link>
      ),
      icon: <FileTextOutlined style={{ color: "black" }} />,
      key: `/${role}/work-order`,
    },
  ];

  const serviceAdvisorItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: (
        <Link className="text-black" href={`/${role}/assignService`}>
          Reports
        </Link>
      ),
      icon: <BarChartOutlined style={{ color: "black" }} />,
      key: `/${role}/assignService`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/invoice-generate`}>
          Invoices
        </Link>
      ),
      icon: <PrinterOutlined  style={{ color: "black" }} />,
      key: `/${role}/invoice-generate`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/estimate/view`}>
          Estimate
        </Link>
      ),
      icon: <CalculatorOutlined style={{ color: "black" }} />,
      key: `/${role}/estimate`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/work-order/view`}>
          WorkOrder
        </Link>
      ),
      icon: <FileTextOutlined style={{ color: "black" }} />,
      key: `/${role}/work-order`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/analysis`}>
          Sells Analysis
        </Link>
      ),
      icon: <AreaChartOutlined style={{ color: "black" }} />,
      key: `/${role}/analysis`,
    },
  ];

  const technicianItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    {
      label: (
        <Link className="text-black" href={`/${role}/estimateInspection`}>
          Inspection
        </Link>
      ),
      icon: <ToolOutlined style={{ color: "black" }} />,
      key: `/${role}/estimateInspection`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/estimateService`}>
          Service
        </Link>
      ),
      icon: <ToolOutlined style={{ color: "black" }} />,
      key: `/${role}/estimateService`,
    },
  ];

  const commonAdminSidebarItems: MenuProps["items"] = [
    {
      label: (
        <Link className="text-black" href={`/${role}/appointment/view`}>
          Appointment
        </Link>
      ),
      icon: <ScheduleOutlined style={{ color: "black" }} />,
      key: `/${role}/appointment/view`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/contact/view`}>
          Contact
        </Link>
      ),
      icon: <ContactsOutlined style={{ color: "black" }} />,
      key: `/${role}/contact`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/concern/view`}>
          Concern
        </Link>
      ),
      icon: <AlertOutlined style={{ color: "black" }} />,
      key: `/${role}/concern`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/inspection/viewInspection`}>
          Inspection
        </Link>
      ),
      icon: <SearchOutlined style={{ color: "black" }} />,
      key: `/${role}/inspection/viewInspection`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/inspection/viewItem`}>
          Inspection Item
        </Link>
      ),
      icon: <UnorderedListOutlined style={{ color: "black" }} />,
      key: `/${role}/inspection/viewItem`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/inspection/viewGroup`}>
          Inspection Group
        </Link>
      ),
      icon: <AppstoreOutlined style={{ color: "black" }} />,
      key: `/${role}/inspection/viewGroup`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/service/view`}>
          Service
        </Link>
      ),
      icon: <ApiOutlined style={{ color: "black" }} />,
      key: `/${role}/service`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/estimate/view`}>
          Estimate
        </Link>
      ),
      icon: <CalculatorOutlined style={{ color: "black" }} />,
      key: `/${role}/estimate`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/work-order/view`}>
          WorkOrder
        </Link>
      ),
      icon: <FileTextOutlined style={{ color: "black" }} />,
      key: `/${role}/work-order`,
    },
      
    {
      label: (
        <Link className="text-black" href={`/${role}/invoice-generate`}>
          Invoices
        </Link>
      ),
      icon: <PrinterOutlined  style={{ color: "black" }} />,
      key: `/${role}/invoice-generate`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/assignService`}>
          Reports
        </Link>
      ),
      icon: <BarChartOutlined style={{ color: "black" }} />,
      key: `/${role}/assignService`,
    },
    {
      label: (
        <Link className="text-black" href={`/${role}/analysis`}>
          Sells Analysis
        </Link>
      ),
      icon: <AreaChartOutlined style={{ color: "black" }} />,
      key: `/${role}/analysis`,
    },
  ];

  const adminSidebarItems: MenuProps["items"] = [
    ...defaultSidebarItems,
    ...commonAdminSidebarItems,
  ];

  if (role === "admin") {
    return adminSidebarItems;
  } else if (role === "storeManager") {
    return storeManagerItems;
  } else if (role === "technician") {
    return technicianItems;
  } else if (role === "serviceAdvisor") {
    return serviceAdvisorItems;
  } else {
    return defaultSidebarItems;
  }
};