import { IInspectionService, IMeta, IServiceInspection, IServiceInspectionConcern, IServiceResponse } from "@/types"
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const Service_URL = "/service"
const Parts_URL = "/parts"

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // service section
        createService: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/create-service`,
                    method: "POST",
                    data,
                };
            },
            invalidatesTags: [tagTypes.createService]
        }),

        updateService: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/update-service`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateService]
        }),

        getAllService: build.query({
            query: ({ currentPage, searchTerm }) => ({
                url: `${Service_URL}/all-services?page=${currentPage}&limit=10&searchTerm=${searchTerm}`,
                method: "GET",
            }),
            providesTags: [tagTypes.service],
        }),

        getServiceByCode: build.query({
            query: (code) => ({
                url: `${Service_URL}/single/${code}`,
                method: "GET",
            }),
            transformResponse: (response: any) => {
                return response;
            },
            providesTags: [tagTypes.singleService]
        }),

        searchService: build.mutation({
            query: (query, page = 1, limit = 10) => ({
                url: `${Service_URL}/search-services?search=${query}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            invalidatesTags: [tagTypes.searchService]
        }),
        deleteServiceLabour: build.mutation({
            query: ({ serviceCode, labourId }) => ({
                url: `${Service_URL}/single/labour/${serviceCode}/${labourId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.deleteServiceLabour]
        }),
        deleteService: build.mutation({
            query: (code) => ({
                url: `${Service_URL}/delete-service/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.service]
        }),

        // parts section
        createParts: build.mutation({
            query: (data) => ({
                url: `${Parts_URL}/create-parts`,
                method: 'POST',
                data,
            }),
            invalidatesTags: [tagTypes.createParts],
        }),

        searchParts: build.mutation({
            query: (query, page = 1, limit = 10) => ({
                url: `${Parts_URL}/search-parts?search=${query}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            invalidatesTags: [tagTypes.searchParts]
        }),

        //create single labour with service code
        createSingleLabour: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/add-single-labour`,
                    method: "POST",
                    data,
                };
            },
            invalidatesTags: [tagTypes.createSingleLabour]
        }),
        updateSingleLabour: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/update-single-labour`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateSingleLabour]
        }),
        updateSinglePart: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/update-single-part`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateSingleLabour]
        }),
        createSinglePart: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/add-single-part`,
                    method: "POST",
                    data,
                };
            },
            invalidatesTags: [tagTypes.createSinglePart]
        }),
        deleteSinglePart: build.mutation({
            query: (data) => ({
                url: `${Service_URL}/single/part/${data}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.deleteSinglePart]
        }),
        deleteRelatedServiceToService: build.mutation({
            query: (code) => ({
                url: `${Service_URL}/relatedService/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.service]
        }),
        assignRelatedService: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/assign-related-service`,
                    method: "POST",
                    data,
                };
            },
            invalidatesTags: [tagTypes.assignRelatedService]
        }),
        updateRelatedServiceToService: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/update-related-service`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.service]
        }),
        deleteRelatedInspectionToService: build.mutation({
            query: ({ code, serviceCode }) => ({
                url: `${Service_URL}/relatedInspection/${code}/${serviceCode}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.service]
        }),
        assignRelatedInspection: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/assign-related-inspection`,
                    method: "POST",
                    data,
                };
            },
            invalidatesTags: [tagTypes.assignRelatedInspection]
        }),
        updateRelatedInspectionToService: build.mutation({
            query: (data) => {
                return {
                    url: `${Service_URL}/update-related-inspection`,
                    method: "PUT",
                    data,
                };
            },
            invalidatesTags: [tagTypes.updateRelatedInspection]
        }),
        getUnassignServiceInspectionAllDataService: build.query({
            query: ({ args, code }: { args: Record<string, any>, code: string }) => ({
                url: `${Service_URL}/${code}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IServiceInspection[], meta: IMeta) => ({
                data: {
                    data: {
                        data: response,
                    },
                },
                meta,
            }),
            providesTags: [tagTypes.getUnassignServiceInspectionAllDataService],
        }),
        getAllInspection: build.mutation({
            query: (query, page = 1, limit = 10) => ({
                url: `/${Service_URL}/get-all-inspections?searchTerm=${query}&page=${page}&limit=${limit}`,
                method: "GET",
            }),
            invalidatesTags: [tagTypes.getInspection],
        }),
        getServiceInspectionAllData: build.query({
            query: (arg: Record<string, any>) => ({
                url: Service_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IInspectionService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.service],
        }),
    }),

})

export const {
    useCreateServiceMutation,
    useGetAllServiceQuery,
    useSearchServiceMutation,
    useDeleteServiceMutation,
    useSearchPartsMutation,
    useCreatePartsMutation,
    useGetServiceByCodeQuery,
    useUpdateServiceMutation,
    useDeleteServiceLabourMutation,
    useCreateSingleLabourMutation,
    useUpdateSingleLabourMutation,
    useCreateSinglePartMutation,
    useDeleteSinglePartMutation,
    useUpdateSinglePartMutation,
    useDeleteRelatedServiceToServiceMutation,
    useAssignRelatedServiceMutation,
    useUpdateRelatedServiceToServiceMutation,
    useDeleteRelatedInspectionToServiceMutation,
    useAssignRelatedInspectionMutation,
    useUpdateRelatedInspectionToServiceMutation,
    useGetUnassignServiceInspectionAllDataServiceQuery,
    useGetAllInspectionMutation,
    useGetServiceInspectionAllDataQuery
} = serviceApi