import { IInspectionItemTire, IMeta, IService } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const InspectionTire_URL = "/inspection-item-tire";

export const inspectionTireApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        inspectionTireCreate: build.mutation({
            query: (data) => ({
                url: `${InspectionTire_URL}/create`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        getAllTireItems: build.query({
            query: (arg: Record<string, any>) => ({
                url: InspectionTire_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IInspectionItemTire[], meta: IMeta) => ({
                tireItem: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionTire],
        }),

        getSingleTireItem: build.query({
            query: (code: string | string[] | undefined) => ({
                url: `${InspectionTire_URL}/single-tire-item/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.inspectionTire],
        }),

        updateTireItemInfo: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionTire_URL}/${code}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),
        createTireStatus: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionTire_URL}/tire-status/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        createTreadDepth: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionTire_URL}/tread-depth/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        createSolutionTire: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionTire_URL}/solution-tire/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        updateTireStatus: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionTire_URL}/tire-status/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        updateTreadDepth: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionTire_URL}/tread-depth/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        updateSolutionTire: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionTire_URL}/solution-tire/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        deleteTireStatus: build.mutation({
            query: (id: string) => ({
                url: `${InspectionTire_URL}/tire-status/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        deleteTreadDepth: build.mutation({
            query: (id: string) => ({
                url: `${InspectionTire_URL}/tread-depth/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        deleteSolutionTire: build.mutation({
            query: (id: string) => ({
                url: `${InspectionTire_URL}/solution-tire/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        deleteInspectionItemTire: build.mutation({
            query: (code: string) => ({
                url: `${InspectionTire_URL}/delete-inspection-tire-item/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        assignInspectionItemTireToService: build.mutation({
            query: ({ code, data }: { code: string; data: any }) => ({
                url: `${InspectionTire_URL}/assign-services/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        unassignInspectionItemTireService: build.mutation({
            query: ({ inspectionItemTireCode, serviceCode }: { inspectionItemTireCode: string; serviceCode: string }) => ({
                url: `${InspectionTire_URL}/unassign-services/${inspectionItemTireCode}/${serviceCode}`,
                method: "POST"
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),

        getInspectionItemTireServices: build.query({
            query: (arg: { code: string }) => ({
                url: `${InspectionTire_URL}/get-all-services/${arg.code}`,
                method: "GET",
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionTire],
        }),

        getUnassignedInspectionItemTireServices: build.query({
            query: ({ args, code }: { args?: Record<string, any>; code: string }) => ({
                url: `${InspectionTire_URL}/get-all-unassign-services/${code}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionTire],
        }),

        updateInspectionItemTireServices: build.mutation({
            query: ({ inspectionItemTireCode, serviceCode, data }) => ({
                url: `${InspectionTire_URL}/update-service-type/${inspectionItemTireCode}/${serviceCode}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionTire],
        }),
    }),
});

export const {
    useInspectionTireCreateMutation,
    useGetAllTireItemsQuery,
    useGetSingleTireItemQuery,
    useUpdateTireItemInfoMutation,
    useCreateTireStatusMutation,
    useCreateTreadDepthMutation,
    useCreateSolutionTireMutation,
    useUpdateTireStatusMutation,
    useUpdateTreadDepthMutation,
    useUpdateSolutionTireMutation,
    useDeleteTireStatusMutation,
    useDeleteTreadDepthMutation,
    useDeleteSolutionTireMutation,
    useAssignInspectionItemTireToServiceMutation,
    useGetInspectionItemTireServicesQuery,
    useUnassignInspectionItemTireServiceMutation,
    useGetUnassignedInspectionItemTireServicesQuery,
    useUpdateInspectionItemTireServicesMutation,
    useDeleteInspectionItemTireMutation
} = inspectionTireApi;
