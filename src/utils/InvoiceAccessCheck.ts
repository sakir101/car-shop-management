import { message } from "antd";
export const checkInvoiceAccess = (role: string,
  estimateType: string) => {
  if (role !== "admin" && estimateType === "Invoice") {
    message.error("Invoice already generated. You don't have access.");
    return false;
  }
  return true;
};