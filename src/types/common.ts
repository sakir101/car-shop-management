import { USER_ROLE } from "@/constant/role";

export interface IMeta {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

export type ResponseSuccessType = {
    data: any,
    meta?: IMeta
}

export type IGenericErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
    path: string | number;
    message: string;
};

export enum Status {
    Available = "Available",
    Unavailable = "Unavailable",
}

export interface IUser {
    id: string;
    name: string;
    password: string;
    email: string;
    address: string;
    contactNum: string;
    role: Role;
    customers?: ICustomer | null;
    employees?: IEmployee | null;
    estimateCustomer: IEstimateCustomer[];
    estimateCustomerAuthorization: IEstimateCustomerAuthorization[];
    providerAuthorization: IEstimateCustomerAuthorization[];
    estimateInspectionInspector: IEstimateInspectionInspector[];
    estimateTechnician: IEstimateTechnician[];
    vehicles: IVehicle[];
    appointmentTechnician: IAppointmentTechnician[];
    appointmentContact: IAppointment[];
    serviceAdvisorAppointment: IAppointment[];
}


export interface IEmployee {
    employeeId: string;
    employeeRole: string;
    employeeSubRole: string;
    employee: IUser;
}

export interface ICustomer {
    customerId: string;
    preferredCommunicationType: string;
    customer: IUser;
    estimates: IEstimateCustomer[]
}

export interface IVehicle {
    id: string
    make: string
    model: string
    year: number
    color: string
    vin: string
    numberPlate: string
    mileage: number
    condition: string
    ownerId: string
    owner: IUser
    estimates: IEstimateVehicle[]
}

export interface IInspectionItems {
    code: string;
    name: string;
    type: string
    customNote: string;
}

export interface IInspectionItemGeneral {
    code: string;
    name: string;
    type: string
    customNote: string;
    services: IInspectionItemGeneralService[]
}

export interface IInspectionProblem {
    id: string
    name: string
    inspectionId: string
    color: string
    inspection: IInspectionItemGeneral
}

export interface IInspectionMAP {
    id: string
    name: string
    inspectionId: string
    inspection: IInspectionItemGeneral
}

export interface InspectionSolutionGeneral {
    id: string
    name: string
    inspectionId: string
    inspection: IInspectionItemGeneral
}

export interface IInspectionItemTire {
    code: string
    name: string
    customNote: string
    psiBefore: string
    services: IInspectionItemTireService[]
}

export interface IInspectionTireStatus {
    id: string
    name: string
    color: string
    inspectionId: string
    inspection: IInspectionItemTire
}

export interface IInspectionTreadDepth {
    id: string
    name: string
    inspectionId: string
    inspection: IInspectionItemTire
}

export interface IInspectionSolutionTire {
    id: string
    name: string
    inspectionId: string
    inspection: IInspectionItemTire
}

export interface IService {
    serviceCode?: string;
    code: string;
    title: string;
    description: string;
    type: string;
    stage?: string;
    concerns: IConcernService[];
    estimates: IEstimateService[];
    estimateServiceLabour: IEstimateServiceLabour[];
    estimateServiceParts: IEstimateServiceParts[];
    estimateTechnician: IEstimateTechnician[];
    inspectionItemGenerals: IInspectionItemGeneralService[];
    inspectionItemTires: IInspectionItemTireService[];
    serviceInspections: IServiceInspection[];
    serviceLabours: IServiceLabour[];
    serviceParts: IServicePart[];
    relatedServices: IServiceService[];
    referencingServices: IServiceService[];
}

export interface IConcernService {
    concernCode: string;
    serviceCode: string;
    type: Type;
    concern: IConcern;
    service: IService;
}

export interface ILabour {
    labourId: string;
    name: string;
    ratePerHour: number;
    estimateServiceLabour: IEstimateServiceLabour[];
    serviceLabours: IServiceLabour[];
}

export interface IServiceLabour {
    id: string;
    serviceCode: string;
    labourId: string;
    hours: number;
    labour: ILabour;
    service: IService;
}

export interface IInspectionItemTireService {
    inspectionItemTireCode: string;
    serviceCode: string;
    type: Type;
    inspectionItemTire: IInspectionItemTire;
    service: IService;
}

export interface IInspectionItemGeneralService {
    inspectionItemTireCode: string;
    serviceCode: string;
    type: Type;
    inspectionItemGeneral: IInspectionItemGeneral;
    service: IService;
}

export interface IPart {
    partId: string;
    name: string;
    unitPrice: number;
    provider: string;
    installationHours: number;
    serviceParts: IServicePart[];
}

export interface IServicePart {
    id: string;
    serviceId: string;
    partId: string;
    quantity: number;
    part: IPart;
    service: IService;
}

export interface IServiceService {
    id: string;
    serviceId: string;
    relatedServiceId: string;
    recommended: boolean;
    required: boolean;
    service: IService;
    relatedService: IService;
}

export interface IConcern {
    code: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    inspections: IConcernInspection[]
    services: IConcernService[];
    estimates: IEstimateConcern[]
}

export interface IConcernInspection {
    concernCode: string;
    inspectionCode: string;
    concern: IConcern;
    inspection: IInspection;
}

export interface IInspectionService {
    code: string,
    title: string,
    description: string,
    type: string
}

export interface IServiceInspectionConcern {
    code: string,
    title: string,
    description: string,
    type: string
}
// Define the innermost object structure
export interface IServiceInspection {
    code: string;
    title: string;
    description: string;
    type: string;
}

// Define the structure for the nested `data` property
export interface IServiceData {
    data: IServiceInspection[];
}


export interface IServiceResponse {
    data: {
        data: IServiceData;
    };
    meta?: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

export interface IContactService {

}

export interface IInspection {
    code: string;
    title: string;
    description: string;
    type: string;
    concerns: IConcernInspection[];
    estimates: IEstimateInspection[];
    estimateInspectionHoursForInspection: IEstimateInspectionHoursForInspection[];
    estimateInspectionInspector: IEstimateInspectionInspector[];
    InspectionGroupInspection: IInspectionGroupInspection[];
    InspectionHoursForInspection: IInspectionHoursForInspection[];
    InspectionItemGeneralForInspection: IInspectionItemGeneralForInspection[];
    InspectionItemTireForInspection: IInspectionItemTireForInspection[];
    relatedServices: IServiceInspection[];
}

export interface IConcernInspection {
    concernCode: string
    inspectionCode: string
    type: Type
    concern: IConcern
    inspection: IInspection

}

export interface IInspectionHours {
    id: string;
    inspectionHourlyRate?: number;
    inspectionHours?: number;
    estimateInspectionHoursForInspection: IEstimateInspectionHoursForInspection[];
    InspectionGroupInspectionHour: IInspectionGroupInspectionHour[];
    InspectionHoursForInspection: IInspectionHoursForInspection[];
}

export interface IInspectionGroup {
    code: string;
    name: string;
    description: string;
    totalAmount?: number;
    totalHours?: string;
    InspectionGroupInspection: IInspectionGroupInspection[];
    InspectionGroupInspectionHour: IInspectionGroupInspectionHour[];
}

export interface IInspectionGroupInspection {
    inspectionCode: string;
    inspectionGroupCode: string;
    Inspection: IInspection;
    InspectionGroup: IInspectionGroup;
}

export interface IInspectionGroupInspectionHour {
    id: string;
    inspectionGroupCode: string;
    inspectionHourId: string;
    InspectionGroup: IInspectionGroup;
    InspectionHour: IInspectionHours;
}

export interface IInspectionItemGeneralForInspection {
    id: string;
    inspectionItemCode: string;
    inspectionCode: string;
    type: string;
    Inspection: IInspection;
    InspectionItemGeneral: IInspectionItemGeneral;
}

export interface IInspectionItemTireForInspection {
    id: string;
    inspectionItemCode: string;
    inspectionCode: string;
    type: string;
    Inspection: IInspection;
    InspectionItemTire: IInspectionItemTire;
}

export interface IInspectionHoursForInspection {
    id: string;
    inspectionId: string;
    inspectionHoursId: string;
    InspectionHours: IInspectionHours;
    Inspection: IInspection;
}

export interface IEstimate {
    code: string;
    title: string;
    description: string;
    inspectionTotalHours?: string;
    labourTotalHours?: string;
    totalHours?: string;
    labourTotalAmount?: number;
    partsTotalAmount?: number;
    inspectionTotalAmount?: number;
    totalAmount?: number;
    status: EstimateStatus;
    type: EstimateType;
    concerns: IEstimateConcern[];
    customers: IEstimateCustomer[];
    estimateAuthorization: IEstimateCustomerAuthorization[];
    inspections: IEstimateInspection[];
    estimateInspectionHoursForInspection: IEstimateInspectionHoursForInspection[];
    estimateInspectionInspector: IEstimateInspectionInspector[];
    services: IEstimateService[];
    estimateServiceLabour: IEstimateServiceLabour[];
    estimateServiceParts: IEstimateServiceParts[];
    estimateTechnician: IEstimateTechnician[];
    vehicle: IEstimateVehicle[];
    appointment?: IAppointment;
}

export interface IEstimateCustomer {
    estimateCode: string
    customerId: string
    customer: ICustomer
    estimate: IEstimate
}

export interface IEstimateVehicle {
    estimateCode: string
    vehicleId: string
    estimate: IEstimate
    vehicle: IVehicle
}

export interface IEstimateConcern {
    estimateCode: string
    concernCode: string
    concern: IConcern
    estimate: IEstimate
}

export interface IEstimateInspection {
    estimateCode: string
    inspectionCode: string
    stage: Stage
    estimate: IEstimate
    inspection: IInspection

}

export interface IEstimateService {
    estimateCode: string
    serviceCode: string
    stage: Stage
    estimate: IEstimate
    service: IService
}

export interface IEstimateCustomerAuthorization {
    estimateCode: string
    customerId: string
    providerId: string
    authorizationStatus: AuthorizationStatus
    authorizationMedium: AuthorizationMedium
    createdAt: Date
    customer: ICustomer
    estimate: IEstimate
    provider: IUser
}

export interface IEstimateServiceParts {
    id: string;
    estimateCode: string;
    serviceCode: string;
    partId: string;
    totalUnit: number;
    stage: Stage;
    estimate: IEstimate;
    part: IPart;
    service: IService;
}

export interface IEstimateServiceLabour {
    id: string;
    estimateCode: string;
    serviceCode: string;
    labourId: string;
    requiredHours: number;
    stage: Stage;
    estimate: IEstimate;
    labour: ILabour;
    service: IService;
}

export interface IEstimateTechnician {
    id: string;
    estimateCode: string;
    technicianId: string;
    percentage: string;
    serviceCode: string;
    stage: Stage;
    estimate: IEstimate;
    service: IService;
    technician: IUser;
}

export interface IEstimateInspectionHoursForInspection {
    id: string;
    estimateCode: string;
    inspectionCode: string;
    inspectionHoursId: string;
    stage: Stage;
    estimate: IEstimate;
    inspection: IInspection;
    inspectionHours: IInspectionHours;
}

export interface IEstimateInspectionInspector {
    id: string;
    estimateCode: string;
    inspectorId: string;
    percentage: string;
    inspectionCode: string;
    stage: Stage;
    estimate: IEstimate;
    inspection: IInspection;
    inspector: IUser;
}


export interface IAppointment {
    id: string;
    estimateCode: string;
    estimate: IEstimate;
    contactId: string;
    contact: IUser;
    serviceAdvisorId?: string;
    serviceAdvisor?: IUser;
    startHour: string;
    endHour: string;
    suggestedHour?: string;
    duration: string;
    odometer: string;
    note: string;
    scheduled: Date;
    tag: Tag;
    createdAt: Date;
    updatedAt: Date;
    technician: IAppointmentTechnician[];
}

export interface IAppointmentTechnician {
    appointmentID: string;
    technicianId: string;
    appointment: IAppointment;
    technician: IUser;
}



export enum Type {
    Required = "Required",
    Recommended = "Recommended",
}

export enum EstimateType {
    Estimate = "Estimate",
    WorkOrder = "WorkOrder",
}

export enum EstimateStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Report_Generated = "Report_Generated"
}

export enum Stage {
    Accept = "Accept",
    Deferred = "Deferred",
}

export enum AuthorizationStatus {
    Complete = "Complete",
    Incomplete = "Incomplete"
}

export enum AuthorizationMedium {
    Mail = "Mail",
    SMS = "SMS",
    Call = "Call"
}

export enum AuthorizationStep {
    Service = "Service",
    Inspection = "Inspection",
}

export enum Tag {
    Waiting_For_Parts = "Waiting_For_Parts",
    Parts_Received = "Parts_Received",
    Waiter = "Waiter",
    Shuttle = "Shuttle",
    Overnight = "Overnight",
    Awaiting_Approval = "Awaiting_Approval",
    Priority = "Priority",
    Invoice_Finalized = "Invoice_Finalized",
    Drop_Off = "Drop_Off"
}

export enum Role {
    admin = "admin",
    storeManager = "storeManager",
    technician = "technician",
    Employee = "Employee",
    Customer = "Customer",
    serviceAdvisor = "serviceAdvisor"
}

export interface IComment {
    name: string;
    comment: string
}

export interface IServiceData {
    serviceName: string;
    serviceCode: string;
    serviceDescription: string;
    parts: IPart[];
    comments: IComment[]
}

export interface ITechnicianInspectionItemTire {
    name: string;
    psiBefore: number | null;
    customNote: string | null;
    dot: string | null;
    solution: string[] | null;
}

export interface ITechnicianInspectionItemGeneral {
    name: string;
    customNote: string | null;
    problem: string[] | null;
    map: string[] | null;
    solution: string[] | null;
}

export interface IFormattedServiceEstimate {
    id: string;
    estimateCode: string;
    technicianInspectionItemTireId: string | null;
    technicianInspectionItemGeneralId: string | null;
    numberPlate: string;
    vehicleModel: string;
    vehicleColor: string;
    createdAt: Date | string;
    customerName: string;
    contactNum: string;
    serviceName: string;
    serviceCode: string;
    serviceDescription: string;
    serviceStatus: string;
}







