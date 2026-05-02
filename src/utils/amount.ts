import { IItemShow } from "@/redux/slice/serviceInspectionItemSlice";

export const calculateUpdateAmount = (oldHours: number, newHours: number, oldHourlyRate: number, newHourlyRate: number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const oldAmount = oldHourlyRate * (oldHours / 60);
    const newAmount = newHourlyRate * (newHours / 60);
    const amount = newAmount - oldAmount;
    const itemTotalAmountUpdated = itemTotalAmount + amount;
    const totalAmountUpdated = totalAmount + amount;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};

export const calculateEstimateUpdateAmountForPart = (oldTotal: number, newTotal: number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const amount = newTotal - oldTotal;
    const itemTotalAmountUpdated = itemTotalAmount + amount;
    const totalAmountUpdated = totalAmount + amount;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};

export const calculateAddAmount = (newHours: number, newHourlyRate: number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const newAmount = newHourlyRate * (newHours / 60);
    const itemTotalAmountUpdated = itemTotalAmount + newAmount;
    const totalAmountUpdated = totalAmount + newAmount;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};

export const calculateEstimateAddAmountForPart = (total:number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const newAmount = total;
    const itemTotalAmountUpdated = itemTotalAmount + newAmount;
    const totalAmountUpdated = totalAmount + newAmount;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};

export const calculateTotalAmount = (state: IItemShow): number => {
    return state.partsTotalAmount + state.labourTotalAmount + state.inspectionTotalAmount;
};

export const calculateGeneralItemAddAmountForPart = (total:number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const itemTotalAmountUpdated = itemTotalAmount + total;
    const totalAmountUpdated = totalAmount + total;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};
export const calculateItemUpdateAmountForPart = (oldTotal: number, newTotal: number, itemTotalAmount: number, totalAmount: number): { itemTotalAmountUpdated: number, totalAmountUpdated: number } => {
    const amount = newTotal - oldTotal;
    const itemTotalAmountUpdated = itemTotalAmount + amount;
    const totalAmountUpdated = totalAmount + amount;
    return { itemTotalAmountUpdated, totalAmountUpdated };
};

export const calculateUnitPriceWithMargin = (unit: number, margin: number) => {
  const gain = unit * (margin / 100)
  return unit + gain
}
