import { IInspectionService, IMeta, IServiceInspection, IServiceResponse } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Concern_URL = "/concern";

export const concernApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        concernCreate: build.mutation({
            query: ({ data }: { data: any }) => ({
                url: `${Concern_URL}/create-concern`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.concern],
        }),

        getServiceInspectionAllData: build.query({
            query: (arg: Record<string, any>) => ({
                url: Concern_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IInspectionService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.concern],
        }),


        assignConcernToService: build.mutation({
            query: ({ data, code }: { data: any, code: string }) => ({
                url: `${Concern_URL}/assign-service/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.assignConcernToService],
        }),
        assignConcernToInspection: build.mutation({
            query: ({ data, code }: { data: any, code: string }) => ({
                url: `${Concern_URL}/assign-inspection/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.assignConcernToService],
        }),


        getConcernServices: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${Concern_URL}/concern-services/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.concern],
        }),

        getConcernInspections: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${Concern_URL}/concern-inspections/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.concern],
        }),
        getConcernsAllData: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${Concern_URL}/concerns`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IInspectionService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.concern],
        }),

        deleteRelatedService: build.mutation({
            query: ({ code, serviceCode }) => ({
                url: `${Concern_URL}/concern-services/${code}/${serviceCode}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.deleteRelatedService]
        }),
        deleteRelatedinspection: build.mutation({
            query: ({ code, inspectionCode }) => ({
                url: `${Concern_URL}/concern-inspections/${code}/${inspectionCode}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.deleteRelatedinspection]
        }),
        deleteConcern: build.mutation({
            query: ({ code }) => ({
                url: `${Concern_URL}/delete-concern/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.concern]
        }),
        updateRelatedService: build.mutation({
            query: (data) => {
                return {
                    url: `${Concern_URL}/update-related-service`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateRelatedService]
        }),
        updateRelatedInspection: build.mutation({
            query: (data) => {
                return {
                    url: `${Concern_URL}/update-related-inspection`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateRelatedInspection]
        }),
        getUnassignServiceInspectionAllData: build.query({
            query: ({ args, code }: { args: Record<string, any>, code: string }) => ({
                url: `${Concern_URL}/${code}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IServiceInspection[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.getUnassignServiceInspectionAllData],
        }),

        updateConcern: build.mutation({
            query: ({ code, data }) => ({
                url: `${Concern_URL}/update-concern/${code}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.concern],
        }),

        getConcernsByCode: build.query({
            query: (code) => ({
                url: `${Concern_URL}/get-concern/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.concern],
        }),

    }),
});


export const {
    useConcernCreateMutation,
    useGetServiceInspectionAllDataQuery,
    useAssignConcernToServiceMutation,
    useAssignConcernToInspectionMutation,
    useGetConcernServicesQuery,
    useGetConcernInspectionsQuery,
    useGetConcernsAllDataQuery,
    useDeleteRelatedServiceMutation,
    useDeleteRelatedinspectionMutation,
    useDeleteConcernMutation,
    useUpdateRelatedInspectionMutation,
    useUpdateRelatedServiceMutation,
    useGetUnassignServiceInspectionAllDataQuery,
    useUpdateConcernMutation,
    useGetConcernsByCodeQuery
} = concernApi;
