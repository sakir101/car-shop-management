import { IItemShow } from "@/redux/slice/serviceInspectionItemSlice";

export const calculateTotalHours = (state: IItemShow): string => {
    let totalHoursPart = 0;
    let totalHoursLabour = 0;
    let totalHoursInspection = 0;

    totalHoursPart += state.part.reduce((acc, part) => acc + part.installationHours, 0);
    totalHoursLabour += state.labour.reduce((acc, labour) => acc + labour.requiredHours, 0);
    totalHoursInspection += state.inspectionHour.reduce((acc, inspection) => acc + inspection.inspectionHours, 0);

    const totalHours = totalHoursPart + totalHoursLabour + totalHoursInspection;


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateTempTotalHours = (state: IItemShow): string => {
    let totalHoursPart = 0;
    let totalHoursLabour = 0;
    let totalHoursInspection = 0;

    totalHoursPart += state.tempPart.reduce((acc, part) => acc + part.installationHours, 0);
    totalHoursLabour += state.tempLabour.reduce((acc, labour) => acc + labour.requiredHours, 0);
    totalHoursInspection += state.tempInspectionHour.reduce((acc, inspection) => acc + inspection.inspectionHours, 0);

    const totalHours = totalHoursPart + totalHoursLabour + totalHoursInspection;


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const calculateLabourTotalHours = (state: IItemShow): string => {
    let totalHours = 0;

    totalHours += state.labour.reduce((acc, labour) => acc + labour.requiredHours, 0);


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateTempLabourTotalHours = (state: IItemShow): string => {
    let totalHours = 0;

    totalHours += state.tempLabour.reduce((acc, labour) => acc + labour.requiredHours, 0);


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateInspectionTotalHours = (state: IItemShow): string => {
    let totalHours = 0;

    totalHours += state.inspectionHour.reduce((acc, inspection) => acc + inspection.inspectionHours, 0);


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateTempInspectionTotalHours = (state: IItemShow): string => {
    let totalHours = 0;

    totalHours += state.tempInspectionHour.reduce((acc, inspection) => acc + inspection.inspectionHours, 0);


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculatePartTotalHours = (state: IItemShow): string => {
    let totalHours = 0;

    totalHours += state.part.reduce((acc, part) => acc + part.installationHours, 0);


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateHours = (item: number): string => {

    const hours = Math.floor(item / 60);
    const minutes = item % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateItemTotalHoursWithoutState = (itemTotalHours: string, currentItemTotalHours: number): string => {
    let totalHours = 0;
    const itemTotalHoursNumber = parseInt(itemTotalHours.split(":")[0], 10) * 60 + parseInt(itemTotalHours.split(":")[1], 10);
    totalHours = itemTotalHoursNumber + currentItemTotalHours;


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const calculateItemTotalHoursUpdated = (itemTotalHours: string, currentItemTotalHours: number, oldHours: number): string => {
    let totalHours = 0;
    const itemTotalHoursNumber = parseInt(itemTotalHours.split(":")[0], 10) * 60 + parseInt(itemTotalHours.split(":")[1], 10);
    totalHours = itemTotalHoursNumber + currentItemTotalHours - oldHours;


    const hours = Math.floor(totalHours / 60);
    const minutes = totalHours % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateTotalHoursWithoutState = (totalHours: string, currentHours: number): string => {
    let totalHoursUpdated = 0;

    const totalHoursNumber = parseInt(totalHours.split(":")[0], 10) * 60 + parseInt(totalHours.split(":")[1], 10);
    totalHoursUpdated = totalHoursNumber + currentHours;


    const hours = Math.floor(totalHoursUpdated / 60);
    const minutes = totalHoursUpdated % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
export const calculateTotalHoursUpdated = (totalHours: string, currentHours: number, oldHours: number): string => {
    let totalHoursUpdated = 0;

    const totalHoursNumber = parseInt(totalHours.split(":")[0], 10) * 60 + parseInt(totalHours.split(":")[1], 10);
    totalHoursUpdated = totalHoursNumber + currentHours - oldHours;


    const hours = Math.floor(totalHoursUpdated / 60);
    const minutes = totalHoursUpdated % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
