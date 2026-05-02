import { IAppointment, IContactService, IEstimate, IMeta, IUser } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Appointment_URL = "/appointment";


export const appointmentApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        appointmentCreate: build.mutation({
            query: ({ data }: { data: any }) => ({
                url: `${Appointment_URL}/create-appointment`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.appointment],
        }),
        getAllAppointment: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${Appointment_URL}/get-appointments`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IAppointment[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.appointment],
        }),
        getAllWorkOrders: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${Appointment_URL}/get-all-workOrders`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IEstimate[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.appointment],
        }),
        getSingleAppointment: build.query({
            query: ({ id }: { id: string }) => ({
                url: `${Appointment_URL}/get-single-appointment/${id}`,
                method: "GET",
            })
        }),
        updateAppointment: build.mutation({
            query: ({ id, data }) => ({
                url: `${Appointment_URL}/update-appointment/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.appointment],
        }),

        deleteAppointment: build.mutation({
            query: (id) => ({
                url: `${Appointment_URL}/delete-appointment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.appointment],
        }),

        getAllContactsAndServices: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${Appointment_URL}/get-contact-service`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IContactService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.appointment],
        }),
        getAllServiceAdvisors: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${Appointment_URL}/get-all-serviceAdvisor`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IUser[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.appointment],
        }),
        getAllTechnicians: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${Appointment_URL}/get-all-technician`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IUser[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.appointment],
        }),
        getServiceAdvisorTechnicians: build.query({
            query: ({ code }: { code: string | null }) => ({
                url: `${Appointment_URL}/get-serviceAdvisor-technicians/${code}`,
                method: "GET",
            })
        }),
        getAllContactForAppointment: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${Appointment_URL}/contact`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response) => ({
                data: response,
            }),
            providesTags: [tagTypes.appointment],
        }),

    }),
});

export const {
    useAppointmentCreateMutation,
    useGetAllAppointmentQuery,
    useGetSingleAppointmentQuery,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useGetAllContactsAndServicesQuery,
    useGetAllServiceAdvisorsQuery,
    useGetAllTechniciansQuery,
    useGetAllWorkOrdersQuery,
    useGetServiceAdvisorTechniciansQuery,
    useGetAllContactForAppointmentQuery
} = appointmentApi;