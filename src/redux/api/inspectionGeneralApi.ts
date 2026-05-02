import { IInspectionItems, IMeta, IService } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const InspectionGeneral_URL = "/inspection-item-general";

export const inspectionGeneralApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        inspectionGeneralCreate: build.mutation({
            query: (data) => ({
                url: `${InspectionGeneral_URL}/create`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        getAllItems: build.query({
            query: (arg: Record<string, any>) => ({
                url: InspectionGeneral_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IInspectionItems[], meta: IMeta) => ({
                items: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionGeneral],
        }),

        getSingleItem: build.query({
            query: (code: string | string[] | undefined) => ({
                url: `${InspectionGeneral_URL}/single-general-item/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.inspectionGeneral],
        }),

        updateGeneralItemInfo: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionGeneral_URL}/${code}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),
        updateInspectionProblem: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionGeneral_URL}/general-problem/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        updateInspectionMap: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionGeneral_URL}/map/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        updateInspectionSolutionGeneral: build.mutation({
            query: ({ id, data }) => ({
                url: `${InspectionGeneral_URL}/solution-general/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        deleteInspectionProblem: build.mutation({
            query: (id: string) => ({
                url: `${InspectionGeneral_URL}/general-problem/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        deleteInspectionMap: build.mutation({
            query: (id: string) => ({
                url: `${InspectionGeneral_URL}/map/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        deleteInspectionSolutionGeneral: build.mutation({
            query: (id: string) => ({
                url: `${InspectionGeneral_URL}/solution-general/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        deleteInspectionItemGeneral: build.mutation({
            query: (code: string) => ({
                url: `${InspectionGeneral_URL}/delete-inspection-general-item/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        createInspectionProblem: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionGeneral_URL}/general-problem/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        createInspectionMap: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionGeneral_URL}/map/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        createInspectionSolutionGeneral: build.mutation({
            query: ({ code, data }) => ({
                url: `${InspectionGeneral_URL}/solution-general/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        assignInspectionItemGeneralToService: build.mutation({
            query: ({ code, data }: { code: string; data: any }) => ({
                url: `${InspectionGeneral_URL}/assign-services/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        unassignInspectionItemGeneralService: build.mutation({
            query: ({ inspectionItemGeneralCode, serviceCode }: { inspectionItemGeneralCode: string; serviceCode: string }) => ({
                url: `${InspectionGeneral_URL}/unassign-services/${inspectionItemGeneralCode}/${serviceCode}`,
                method: "POST"
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

        getInspectionItemGeneralServices: build.query({
            query: (arg: { code: string }) => ({
                url: `${InspectionGeneral_URL}/get-all-services/${arg.code}`,
                method: "GET",
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionGeneral],
        }),

        getUnassignedInspectionItemGeneralServices: build.query({
            query: ({ args, code }: { args?: Record<string, any>; code: string }) => ({
                url: `${InspectionGeneral_URL}/get-all-unassign-services/${code}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.inspectionGeneral],
        }),
        updateInspectionItemGeneralServices: build.mutation({
            query: ({ inspectionItemGeneralCode, serviceCode, data }) => ({
                url: `${InspectionGeneral_URL}/update-service-type/${inspectionItemGeneralCode}/${serviceCode}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.inspectionGeneral],
        }),

    }),
});

export const {
    useInspectionGeneralCreateMutation,
    useGetAllItemsQuery,
    useGetSingleItemQuery,
    useUpdateGeneralItemInfoMutation,
    useUpdateInspectionProblemMutation,
    useUpdateInspectionMapMutation,
    useUpdateInspectionSolutionGeneralMutation,
    useDeleteInspectionProblemMutation,
    useDeleteInspectionMapMutation,
    useDeleteInspectionSolutionGeneralMutation,
    useCreateInspectionProblemMutation,
    useCreateInspectionMapMutation,
    useCreateInspectionSolutionGeneralMutation,
    useAssignInspectionItemGeneralToServiceMutation,
    useUnassignInspectionItemGeneralServiceMutation,
    useGetInspectionItemGeneralServicesQuery,
    useGetUnassignedInspectionItemGeneralServicesQuery,
    useUpdateInspectionItemGeneralServicesMutation,
    useDeleteInspectionItemGeneralMutation
} = inspectionGeneralApi;
