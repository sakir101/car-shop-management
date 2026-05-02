import { IMeta, IServiceInspectionConcern, IEstimate, IUser } from "@/types";
import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";

const StoreManager_URL = "/storeManager";

export const estimateApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Create Estimate
        createEstimate: build.mutation({
            query: ({ data }: { data: any }) => ({
                url: `${StoreManager_URL}/create-estimate`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Get all services, inspections, concerns
        getServiceInspectionConcernAllData: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${StoreManager_URL}/get-all-services-inspections-concerns`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IServiceInspectionConcern[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get all estimates
        getAllEstimates: build.query({
            query: (arg?: Record<string, any>) => ({
                url: StoreManager_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IEstimate[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get a single estimate
        getSingleEstimate: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-single-estimate/${code}`,
                method: "GET",
            }),
        }),
        // Get a single work-order
        getSingleWorkOrder: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-single-work-order/${code}`,
                method: "GET",
            }),
        }),

        // Update estimate
        updateEstimate: build.mutation({
            query: ({ code, data }) => ({
                url: `${StoreManager_URL}/update-estimate/${code}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        deleteEstimate: build.mutation({
            query: (code) => ({
                url: `${StoreManager_URL}/delete-estimate/${code}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Get estimate concerns
        getEstimateConcerns: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-estimate-concern/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get estimate inspections
        getEstimateInspections: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-estimate-inspection/${code}`,
                method: "GET"
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get estimate services
        getEstimateServices: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-estimate-service/${code}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get unassigned services, inspections, and concerns
        getUnassignServiceInspectionConcernAllData: build.query({
            query: ({ args, code }: { args?: Record<string, any>; code: string }) => ({
                url: `${StoreManager_URL}/get-unassign-services-inspections-concerns/${code}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IServiceInspectionConcern[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Assign concern to estimate
        assignConcernToEstimate: build.mutation({
            query: ({ code, data }: { code: string; data: any }) => ({
                url: `${StoreManager_URL}/assign-concern-estimate/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Assign inspection to estimate
        assignInspectionToEstimate: build.mutation({
            query: ({ code, data }: { code: string; data: any }) => ({
                url: `${StoreManager_URL}/assign-inspection-estimate/${code}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Assign service to estimate
        assignServiceToEstimate: build.mutation({
            query: ({ code, data }: { code: string; data: any }) => ({
                url: `${StoreManager_URL}/assign-service-estimate/${code}`,
                method: "POST",
                data
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Get all estimates
        getAllUsers: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${StoreManager_URL}/all-users`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IUser[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.estimate],
        }),

        getCarsBySearchTerm: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${StoreManager_URL}/car`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response) => ({
                items: response,
            }),
            providesTags: [tagTypes.estimate],
        }),

       getOwnerVehicle: build.query({
        query: ({ code }: { code: string }) => ({
          url: `${StoreManager_URL}/get-owner-vehicle/${code}`,
          method: "GET",
        }),
        providesTags: [tagTypes.estimate],
      }),

        updateEstimateServiceType: build.mutation({
            query: ({ estimateCode, serviceCode, providerId, data }) => ({
                url: `${StoreManager_URL}/update-service-type/${estimateCode}/${serviceCode}/${providerId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        updateEstimateInspectionType: build.mutation({
            query: ({ estimateCode, inspectionCode, providerId, data }) => ({
                url: `${StoreManager_URL}/update-inspection-type/${estimateCode}/${inspectionCode}/${providerId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Add Part to Service in Estimate
        addPartsData: build.mutation({
            query: ({ estimateCode, serviceCode, providerId, data }) => ({
                url: `${StoreManager_URL}/add-part/${estimateCode}/${serviceCode}/${providerId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Add Labour to Service in Estimate
        addLaboursData: build.mutation({
            query: ({ estimateCode, serviceCode, providerId, data }) => ({
                url: `${StoreManager_URL}/add-labour/${estimateCode}/${serviceCode}/${providerId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Add Mechanic Percentage to Estimate
        addMechanicPercentageData: build.mutation({
            query: ({ estimateCode, serviceCode, data }) => ({
                url: `${StoreManager_URL}/add-mechanic-percentage/${estimateCode}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Add Inspection Hours to Estimate
        addInspectionHoursEstimate: build.mutation({
            query: ({ estimateCode, inspectionCode, providerId, data }) => ({
                url: `${StoreManager_URL}/add-inspection-hours/${estimateCode}/${inspectionCode}/${providerId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Add Inspection Percentage to Estimate
        addInspectionPercentageData: build.mutation({
            query: ({ estimateCode, inspectionCode, data }) => ({
                url: `${StoreManager_URL}/add-inspection-percentage/${estimateCode}/${inspectionCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Delete Part from Estimate Service
        deletePartData: build.mutation({
            query: ({ estimateCode, serviceCode, partId, providerId }) => ({
                url: `${StoreManager_URL}/delete-part/${estimateCode}/${serviceCode}/${partId}/${providerId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Delete Labour from Estimate Service
        deleteLabourData: build.mutation({
            query: ({ estimateCode, serviceCode, labourId, providerId }) => ({
                url: `${StoreManager_URL}/delete-labour/${estimateCode}/${serviceCode}/${labourId}/${providerId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Delete Mechanic Percentage
        deleteMechanicPercentageData: build.mutation({
            query: ({ estimateMechanicPercentageId }) => ({
                url: `${StoreManager_URL}/delete-mechanic-percentage/${estimateMechanicPercentageId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Delete Inspection Hours
        deleteInspectionHours: build.mutation({
            query: ({ estimateCode, inspectionCode, inspectionHoursId, providerId }) => ({
                url: `${StoreManager_URL}/delete-inspection-hour/${estimateCode}/${inspectionCode}/${inspectionHoursId}/${providerId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Delete Inspection Percentage
        deleteInspectionPercentage: build.mutation({
            query: ({ estimateInspectionPercentageId }) => ({
                url: `${StoreManager_URL}/delete-inspection-percentage/${estimateInspectionPercentageId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),

        // Get All Parts in Estimate Service
        getAllParts: build.query({
            query: ({ estimateCode, serviceCode }) => ({
                url: `${StoreManager_URL}/get-all-parts/${estimateCode}/${serviceCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get All Labours in Estimate Service
        getAllLabours: build.query({
            query: ({ estimateCode, serviceCode }) => ({
                url: `${StoreManager_URL}/get-all-labours/${estimateCode}/${serviceCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get All Mechanic Percentages in Estimate
        getAllMechanicPercentages: build.query({
            query: ({ estimateCode, serviceCode }) => ({
                url: `${StoreManager_URL}/get-all-mechanic-percentage/${estimateCode}/${serviceCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        // Get All Inspection Hours in Estimate
        getAllInspectionHours: build.query({
            query: ({ estimateCode, inspectionCode }: { estimateCode: string; inspectionCode: string }) => ({
                url: `${StoreManager_URL}/get-all-inspection-hours/${estimateCode}/${inspectionCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        // Get All Inspection Percentages in Estimate
        getAllInspectionPercentages: build.query({
            query: ({ estimateCode, inspectionCode }) => ({
                url: `${StoreManager_URL}/get-all-inspection-percentage/${estimateCode}/${inspectionCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        getRelatedServicesAndInspections: build.query({
            query: ({ concernCode }) => ({
                url: `${StoreManager_URL}/get-related-services-inspections/${concernCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        getRelatedServicesAndInspectionsFromService: build.query({
            query: ({ serviceCode }) => ({
                url: `${StoreManager_URL}/get-related-services-inspections-from-service/${serviceCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        getRelatedInspectionItemsFromInspection: build.query({
            query: ({ inspectionCode }) => ({
                url: `${StoreManager_URL}/get-related-inspection-items-from-inspection/${inspectionCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        updatePartData: build.mutation({
            query: ({ estimateCode, serviceCode, partId, providerId, data }) => ({
                url: `${StoreManager_URL}/update-part/${estimateCode}/${serviceCode}/${partId}/${providerId}`,
                method: "PATCH",
                data,
            }),
        }),
        updateLabourData: build.mutation({
            query: ({ estimateCode, serviceCode, labourId, providerId, data }) => ({
                url: `${StoreManager_URL}/update-labour/${estimateCode}/${serviceCode}/${labourId}/${providerId}`,
                method: "PATCH",
                data,
            }),
        }),
        updateMechanicPercentageData: build.mutation({
            query: ({ estimateCode, serviceCode, estimateMechanicPercentageId, data }) => ({
                url: `${StoreManager_URL}/update-mechanic-percentage/${estimateCode}/${serviceCode}/${estimateMechanicPercentageId}`,
                method: "PATCH",
                data,
            }),
        }),
        updateInspectionHoursData: build.mutation({
            query: ({ estimateCode, inspectionCode, inspectionHoursId, providerId, data }) => ({
                url: `${StoreManager_URL}/update-inspection-hours/${estimateCode}/${inspectionCode}/${inspectionHoursId}/${providerId}`,
                method: "PATCH",
                data,
            }),
        }),
        updateInspectionPercentageData: build.mutation({
            query: ({ estimateCode, inspectionCode, inspectionPercentageId, data }) => ({
                url: `${StoreManager_URL}/update-inspection-percentage/${estimateCode}/${inspectionCode}/${inspectionPercentageId}`,
                method: "PATCH",
                data,
            }),
        }),
        getAllCustomerContract: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${StoreManager_URL}/get-all-customer`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response, meta: IMeta) => ({
                items: response,
            }),
            providesTags: [tagTypes.contract],
        }),
        // Create authorization
        createAuthorization: build.mutation({
            query: ({ data }) => ({
                url: `${StoreManager_URL}/create-authorization`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        // Update authorization
        updateAuthorization: build.mutation({
            query: ({ id, data }) => ({
                url: `${StoreManager_URL}/update-authorization/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        updateAllAuthorization: build.mutation({
            query: ({ data }) => ({
                url: `${StoreManager_URL}/update-all-authorizations`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        // Get All authorizations
        getAllAuthorizations: build.query({
            query: ({ estimateCode }) => ({
                url: `${StoreManager_URL}/get-authorization/${estimateCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),

        deleteCustomerFromEstimate: build.mutation({
            query: ({ estimateCode, customerId, vehicleId }) => ({
                url: `${StoreManager_URL}/delete-customer-vehicle/${estimateCode}/${customerId}/${vehicleId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        getAllTechnicians: build.query({
            query: ({ estimateCode, arg }: { estimateCode: string, arg?: Record<string, any> }) => ({
                url: `${StoreManager_URL}/get-all-technicians/${estimateCode}`,
                method: "GET",
                params: arg,
            }),
            providesTags: [tagTypes.estimate],
        }),
        getAuthorizationStatus: build.query({
            query: ({ estimateCode }) => ({
                url: `${StoreManager_URL}/get-authorization-status/${estimateCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        deleteAuthorization: build.mutation({
            query: ({ authorizationId }) => ({
                url: `${StoreManager_URL}/delete-authorization/${authorizationId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        assignTechnicianToEstimate: build.mutation({
            query: ({ estimateCode, technicianId }) => ({
                url: `${StoreManager_URL}/assign-technician-estimate/${estimateCode}/${technicianId}`,
                method: "POST",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        unassignTechnicianFromEstimate: build.mutation({
            query: ({ estimateCode, technicianId }) => ({
                url: `${StoreManager_URL}/unassign-technician-estimate/${estimateCode}/${technicianId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        getAllAssignedTechniciansToEstimate: build.query({
            query: ({ estimateCode }) => ({
                url: `${StoreManager_URL}/get-assigned-technician-estimate/${estimateCode}`,
                method: "GET",
            }),
            providesTags: [tagTypes.estimate],
        }),
        getAllTechniciansWhenCreateEstimate: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${StoreManager_URL}/get-technician-created-estimates`,
                method: "GET",
                params: arg,
            }),
            providesTags: [tagTypes.estimate],
        }),
        getAllAssignedTechnicians: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-assigned-technician-estimate/${code}`,
                method: "GET",
            })
        }),
        assignCustomerVehicleToEstimate: build.mutation({
            query: ({ estimateCode, payload }) => ({
                url: `${StoreManager_URL}/assign-customer-vehicle/${estimateCode}`,
                method: "POST",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        updateEstimateService: build.mutation({
            query: ({ estimateCode, serviceCode, payload }) => ({
                url: `${StoreManager_URL}/update-estimate-service/${estimateCode}/${serviceCode}`,
                method: "PATCH",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        updateEstimateInspection: build.mutation({
            query: ({ estimateCode, inspectionCode, payload }) => ({
                url: `${StoreManager_URL}/update-estimate-inspection/${estimateCode}/${inspectionCode}`,
                method: "PATCH",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        updateEstimateConcern: build.mutation({
            query: ({ estimateCode, concernCode, payload }) => ({
                url: `${StoreManager_URL}/update-estimate-concern/${estimateCode}/${concernCode}`,
                method: "PATCH",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
         getAllAuthorization: build.query({
            query: ({ code }: { code: string }) => ({
                url: `${StoreManager_URL}/get-authorization/${code}`,
                method: "GET",
            }),
        }),
        getSellAnalysisReport:build.query({
            query: (args) => ({
                url: `${StoreManager_URL}/get-sell-analysis`,
                method: "GET",
                params: args,
            })
        }),
    }),
});



export const {
    useCreateEstimateMutation,
    useGetServiceInspectionConcernAllDataQuery,
    useGetAllEstimatesQuery,
    useGetSingleEstimateQuery,
    useGetSingleWorkOrderQuery,
    useUpdateEstimateMutation,
    useGetEstimateConcernsQuery,
    useGetEstimateInspectionsQuery,
    useGetEstimateServicesQuery,
    useGetUnassignServiceInspectionConcernAllDataQuery,
    useAssignConcernToEstimateMutation,
    useAssignInspectionToEstimateMutation,
    useAssignServiceToEstimateMutation,
    useGetAllUsersQuery,
    useGetCarsBySearchTermQuery,
    useDeleteEstimateMutation,
    useGetOwnerVehicleQuery,
    useUpdateEstimateInspectionTypeMutation,
    useUpdateEstimateServiceTypeMutation,
    useAddPartsDataMutation,
    useAddLaboursDataMutation,
    useAddMechanicPercentageDataMutation,
    useAddInspectionHoursEstimateMutation,
    useAddInspectionPercentageDataMutation,
    useDeletePartDataMutation,
    useDeleteLabourDataMutation,
    useDeleteMechanicPercentageDataMutation,
    useDeleteInspectionHoursMutation,
    useDeleteInspectionPercentageMutation,
    useGetAllPartsQuery,
    useGetAllLaboursQuery,
    useGetAllMechanicPercentagesQuery,
    useGetAllInspectionHoursQuery,
    useGetAllInspectionPercentagesQuery,
    useGetRelatedServicesAndInspectionsQuery,
    useGetRelatedServicesAndInspectionsFromServiceQuery,
    useGetRelatedInspectionItemsFromInspectionQuery,
    useUpdatePartDataMutation,
    useUpdateLabourDataMutation,
    useUpdateMechanicPercentageDataMutation,
    useUpdateInspectionHoursDataMutation,
    useUpdateInspectionPercentageDataMutation,
    useGetAllCustomerContractQuery,
    useCreateAuthorizationMutation,
    useUpdateAuthorizationMutation,
    useGetAllAuthorizationsQuery,
    useDeleteCustomerFromEstimateMutation,
    useGetAllTechniciansQuery,
    useGetAuthorizationStatusQuery,
    useDeleteAuthorizationMutation,
    useAssignTechnicianToEstimateMutation,
    useUnassignTechnicianFromEstimateMutation,
    useGetAllAssignedTechniciansToEstimateQuery,
    useGetAllTechniciansWhenCreateEstimateQuery,
    useGetAllAssignedTechniciansQuery,
    useUpdateAllAuthorizationMutation,
    useAssignCustomerVehicleToEstimateMutation,
    useUpdateEstimateServiceMutation,
    useUpdateEstimateInspectionMutation,
    useUpdateEstimateConcernMutation,
    useGetAllAuthorizationQuery,
    useGetSellAnalysisReportQuery
    
} = estimateApi;
