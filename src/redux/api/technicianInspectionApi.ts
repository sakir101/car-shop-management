import { IInspectionService, IMeta, IServiceInspection, IServiceInspectionConcern, IServiceResponse } from "@/types"
import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const dashboardForTask = "/task-dashboard"


export const taskApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUnassignItemInspectionForTechnician: build.query({
            query: ({ inspectionCode, estimateCode }: { inspectionCode: string; estimateCode: string }) => ({
                url: `${dashboardForTask}/get-all-inspection-items-in-inspection/${inspectionCode}/${estimateCode}`,
                method: "GET"
            }),
        }),
        getConcernsByEstimateForTechnician: build.query({
            query: (estimateCode) => ({
                url: `${dashboardForTask}/get-concerns-by-estimate/${estimateCode}`,
                method: "GET"
            }),
        }),
        getCarByEstimateForTechnician: build.query({
            query: (id) => ({
                url: `${dashboardForTask}/get-car-by-estimate/${id}`,
                method: "GET"
            }),
        }),
        createInspectionTire: build.mutation({
            query: (formData) => {
                return {
                    url: `${dashboardForTask}/create-technician-inspection-tire`,
                    method: "POST",
                    data: formData, // ✅ FIXED
                    contentType: 'multipart/form-data'
                };
            },
        }),
        getInspectionData: build.query({
            query: ({ userId, args }) => ({
                url: `${dashboardForTask}/get-inspections-by-technician/${userId}`,
                method: "GET",
                params: args
            }),

            transformResponse: (response: IInspectionService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.getInspectionData]
        }),
        updateInspectionDataStatus: build.mutation({
            query: (data) => ({
                url: `${dashboardForTask}/update-estimate-inspection-status`,
                method: "PUT",
                data
            }),
            invalidatesTags: [tagTypes.getInspectionData]
        }),

        getSingleInspectionData: build.query({
            query: (data) => ({
                url: `${dashboardForTask}/get-technician-inspection/${data.inspectionCode}/${data.estimateCode}`,
                method: "GET",
            }),


            providesTags: [tagTypes.getSingleInspectionData]
        }),
        getTechnicianSingleTireItem: build.query({
            query: (id) => ({
                url: `${dashboardForTask}/get-single-item/${id}`,
                method: "GET",
            }),


            providesTags: [tagTypes.getSingleItem]
        }),
        // /update-technician-inspection-item-general/:id
        updateTechnicalInspectionItemGeneral: build.mutation({
            query: ({ id, formData }) => ({
                url: `${dashboardForTask}/update-technician-inspection-item-general/${id}`,
                method: "PATCH",
                data: formData,
                contentType: "multipart/form-data",
            }),
            invalidatesTags: [tagTypes.getSingleInspectionData],
        }),
        ///update-technician-inspection-item-tire
        updateTechnicalInspectionItemTire: build.mutation({
            query: ({ formData, id }) => ({
                url: `${dashboardForTask}/update-technician-inspection-item-tire/${id}`,
                method: "PATCH",
                data: formData,
                contentType: "multipart/form-data",
            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        updateTechnicalInspectionItemTireStatus: build.mutation({
            query: (data) => ({
                url: `${dashboardForTask}/add-tire-status/${data?.id}`,
                method: "patch",
                data
            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        updateTechnicalInspectionItemTireSolution: build.mutation({
            query: (data) => ({
                url: `${dashboardForTask}/add-tire-solution/${data?.id}`,
                method: "patch",
                data
            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        updateTechnicalInspectionItemTreadDepth: build.mutation({
            query: (data) => ({
                url: `${dashboardForTask}/add-tread-depth/${data?.id}`,
                method: "patch",
                data
            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        getTireStatusTreadDepth: build.query({
            query: (id) => ({
                url: `${dashboardForTask}/get-tread-depth-tire-status/${id}`,
                method: "GET",

            }),
            providesTags: [tagTypes.getTireStatusTreadDepth]
        }),
        createNewTire: build.mutation({
            query: ({ formData, id }) => {

                return {
                    url: `${dashboardForTask}/create-new-tire/${id}`,
                    method: "POST",
                    data: formData,
                    contentType: "multipart/form-data",
                };
            },
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        //inspect-inspection-item-general
        createInspectionItemGeneral: build.mutation({
            query: (formData) => {
                return {
                    url: `${dashboardForTask}/inspect-inspection-item-general`,
                    method: "POST",
                    data: formData,
                    contentType: 'multipart/form-data'
                };
            },
            invalidatesTags: [tagTypes.createInstaspectionTask]
        }),
        //create-technician-inspection-tire
        // createInspectionItemTire: build.mutation({
        //     query: (data) => {
        //         return {
        //             url: `${dashboardForTask}/create-technician-inspection-tire`,
        //             method: "POST",
        //             data,
        //         };
        //     },
        //     invalidatesTags: [tagTypes.createInstaspectionTask]
        // }),

        ///task-dashboard/get-concerns-by-estimate/${estimateCode}
        getConcernByEstimate: build.query({
            query: (id) => ({
                url: `${dashboardForTask}/get-concerns-by-estimate/${id}`,
                method: "GET",
            }),


            providesTags: [tagTypes.getSingleItem]
        }),
        ///inspection-item-tire/single-tire-item/${code}
        // /inspection-item-tire/single-tire-item
        inspectionItemTireSingleTireItem: build.query({
            query: (id) => ({
                url: `/inspection-item-tire/single-tire-item/${id}`,
                method: "GET",
            }),


            providesTags: [tagTypes.getSingleItem]
        }),
        ///get-car-by-estimate/${estimateCode}
        getCarByEstimate: build.query({
            query: (id) => ({
                url: `${dashboardForTask}/get-car-by-estimate/${id}`,
                method: "GET",
            }),


            providesTags: [tagTypes.getSingleItem]
        }),
        ///delete-general-image/:id
        deleteGeneralImage: build.mutation({
            query: (id) => ({
                url: `${dashboardForTask}/delete-general-image/${id}`,
                method: "DELETE",

            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
        deleteTireImage: build.mutation({
            query: (id) => ({
                url: `${dashboardForTask}/delete-tire-image/${id}`,
                method: "DELETE",

            }),
            invalidatesTags: [tagTypes.getSingleInspectionData]
        }),
    }),

})
export const {
    useGetUnassignItemInspectionForTechnicianQuery,
    useGetConcernsByEstimateForTechnicianQuery,
    useGetCarByEstimateForTechnicianQuery,
    useCreateInspectionTireMutation,
    useGetInspectionDataQuery,
    useUpdateInspectionDataStatusMutation,
    useGetSingleInspectionDataQuery,
    useGetTechnicianSingleTireItemQuery,
    useUpdateTechnicalInspectionItemGeneralMutation,
    useUpdateTechnicalInspectionItemTireMutation,
    useUpdateTechnicalInspectionItemTireStatusMutation,
    useUpdateTechnicalInspectionItemTreadDepthMutation,
    useGetTireStatusTreadDepthQuery,
    useCreateNewTireMutation,
    useUpdateTechnicalInspectionItemTireSolutionMutation,
    useCreateInspectionItemGeneralMutation,
    // useCreateInspectionItemTireMutation,
    useGetConcernByEstimateQuery,
    useInspectionItemTireSingleTireItemQuery,
    useGetCarByEstimateQuery,
    useDeleteGeneralImageMutation,
    useDeleteTireImageMutation,
} = taskApi