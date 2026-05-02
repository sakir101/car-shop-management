import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IEstimate, IMeta, IService } from "@/types";

const ServiceAdvisor_URL = "/serviceAdvisor";

export const serviceAdvisorApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEstimatesForServiceAdvisor: build.query({
            query: (arg?: Record<string, any>) => ({
                url: `${ServiceAdvisor_URL}/get-all-estimates-for-serviceAdvisor`,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IEstimate[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.serviceAdvisor],
        }),

        getSingleGeneralItem: build.query({
            query: ({ id }: { id: string }) => ({
                url: `${ServiceAdvisor_URL}/get-single-general-item/${id}`,
                method: "GET",
            })
        }),

        getUnassignedServiceGeneralItem: build.query({
            query: ({ args, technicianInspectionItemGeneralId }: { args?: Record<string, any>; technicianInspectionItemGeneralId: string }) => ({
                url: `${ServiceAdvisor_URL}/get-unassign-service-general-item/${technicianInspectionItemGeneralId}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.serviceAdvisor],
        }),

        assignServiceToGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, data }: { technicianInspectionItemGeneralId: string; data: any }) => ({
                url: `${ServiceAdvisor_URL}/assign-service-general-item/${technicianInspectionItemGeneralId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateServiceTypeGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/update-service-type-general-item/${technicianInspectionItemGeneralId}/${serviceCode}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addPartGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-part-general-item/${technicianInspectionItemGeneralId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addLabourGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-labour-general-item/${technicianInspectionItemGeneralId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addTechnicianGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-technician-percentage-general-item/${technicianInspectionItemGeneralId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deletePartGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, partId }) => ({
                url: `${ServiceAdvisor_URL}/delete-part-general-item/${technicianInspectionItemGeneralId}/${serviceCode}/${partId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deleteLabourGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, labourId }) => ({
                url: `${ServiceAdvisor_URL}/delete-labour-general-item/${technicianInspectionItemGeneralId}/${serviceCode}/${labourId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deleteTechnicianPercentageGeneralItem: build.mutation({
            query: ({ technicianPercentageItemGeneralId }) => ({
                url: `${ServiceAdvisor_URL}/delete-technician-percentage-general-item/${technicianPercentageItemGeneralId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updatePartGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, partId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-part-general-item/${technicianInspectionItemGeneralId}/${serviceCode}/${partId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateLabourGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, labourId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-labour-general-item/${technicianInspectionItemGeneralId}/${serviceCode}/${labourId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateTechnicianPercentageGeneralItem: build.mutation({
            query: ({ technicianInspectionItemGeneralId, serviceCode, technicianPercentageId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-technician-percentage-general-item/${technicianInspectionItemGeneralId}/${serviceCode}/${technicianPercentageId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        getSingleTireItem: build.query({
            query: ({ id }: { id: string }) => ({
                url: `${ServiceAdvisor_URL}/get-single-tire-item/${id}`,
                method: "GET"
            })
        }),

        getUnassignedServiceTireItem: build.query({
            query: ({ args, technicianInspectionItemTireId }: { args?: Record<string, any>; technicianInspectionItemTireId: string }) => ({
                url: `${ServiceAdvisor_URL}/get-unassign-service-tire-item/${technicianInspectionItemTireId}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.serviceAdvisor],
        }),

        assignServiceToTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, data }: { technicianInspectionItemTireId: string; data: any }) => ({
                url: `${ServiceAdvisor_URL}/assign-service-tire-item/${technicianInspectionItemTireId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateServiceTypeTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/update-service-type-tire-item/${technicianInspectionItemTireId}/${serviceCode}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addPartTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-part-tire-item/${technicianInspectionItemTireId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addLabourTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-labour-tire-item/${technicianInspectionItemTireId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        addTechnicianTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, data }) => ({
                url: `${ServiceAdvisor_URL}/add-technician-percentage-tire-item/${technicianInspectionItemTireId}/${serviceCode}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deletePartTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, partId }) => ({
                url: `${ServiceAdvisor_URL}/delete-part-tire-item/${technicianInspectionItemTireId}/${serviceCode}/${partId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deleteLabourTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, labourId }) => ({
                url: `${ServiceAdvisor_URL}/delete-labour-tire-item/${technicianInspectionItemTireId}/${serviceCode}/${labourId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        deleteTechnicianPercentageTireItem: build.mutation({
            query: ({ technicianPercentageItemTireId }: { technicianPercentageItemTireId: string }) => ({
                url: `${ServiceAdvisor_URL}/delete-technician-percentage-tire-item/${technicianPercentageItemTireId}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updatePartTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, partId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-part-tire-item/${technicianInspectionItemTireId}/${serviceCode}/${partId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateLabourTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, labourId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-labour-tire-item/${technicianInspectionItemTireId}/${serviceCode}/${labourId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        updateTechnicianPercentageTireItem: build.mutation({
            query: ({ technicianInspectionItemTireId, serviceCode, technicianPercentageId, data }) => ({
                url: `${ServiceAdvisor_URL}/update-technician-percentage-tire-item/${technicianInspectionItemTireId}/${serviceCode}/${technicianPercentageId}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),

        getRelatedServicesFromService: build.query({
            query: ({ serviceCode }: { serviceCode: string }) => ({
                url: `${ServiceAdvisor_URL}/get-related-services-from-service-general-tire/${serviceCode}`,
                method: "GET"
            })
        }),
        getSingleEstimatesForServiceAdvisor: build.query({
            query: (code?: Record<string, any>) => ({
                url: `${ServiceAdvisor_URL}/get-single-estimates-for-serviceAdvisor/${code}`,
                method: "GET",
            }),
            transformResponse: (response: IEstimate[]) => ({
                data: response,
            }),
            providesTags: [tagTypes.serviceAdvisor],
        }),
        updateItemServiceStage: build.mutation({
            query: (data) => ({
                url: `${ServiceAdvisor_URL}/update-item-service-stage`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),
        createReport: build.mutation({
            query: (data) => ({
                url: `${ServiceAdvisor_URL}/create-report`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),
        getReportByCustomerId: build.query({
            query: (code) => ({
                url: `${ServiceAdvisor_URL}/get-report-by-custom-id/${code}`,
                method: "GET"
            })
        }),

        getInvoiceItem: build.query({
            query: (arg: Record<string, any>) => ({
                url: `${ServiceAdvisor_URL}/get-invoice`,
                method: "GET",
                params: arg,
            }),
        }),
        getSingleInvoiceItem: build.query({
            query: ({ code }: { code: any }) => ({
                url: `${ServiceAdvisor_URL}/get-single-invoice/${code}`,
                method: "GET"
            })
        }),
        updateReport: build.mutation({
            query: ({ customId, data }: { customId: string, data: any }) => {

                return {
                    url: `${ServiceAdvisor_URL}/update-report-amount/${customId}`,
                    method: "PATCH",
                    data,
                };
            },
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),
        updateReportByEstimateCode: build.mutation({
            query: ({ code, data }: { code: string, data: any }) => {
                return {
                    url: `${ServiceAdvisor_URL}/update-report-amount-by-estimate/${code}`,
                    method: "PATCH",
                    data,
                };
            },
            invalidatesTags: [tagTypes.serviceAdvisor],
        }),
        sendInvoiceToUser: build.mutation({
            query: (formData: FormData) => ({
                url: `${ServiceAdvisor_URL}/send-invoice`,
                method: "POST",
                data: formData,
                contentType: "multipart/form-data",
            }),
            invalidatesTags: [tagTypes.sendInvoiceToUser],
        }),
        sendReportToUser: build.mutation({
            query: (data) => ({
                url: `${ServiceAdvisor_URL}/send-report`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.sendReportToUser],
        }),
        updateTireService: build.mutation({
            query: ({ tireId, serviceCode, payload }) => ({
                url: `${ServiceAdvisor_URL}/update-tire-service/${tireId}/${serviceCode}`,
                method: "PATCH",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        updateGeneralService: build.mutation({
            query: ({ generalId, serviceCode, payload }) => ({
                url: `${ServiceAdvisor_URL}/update-general-service/${generalId}/${serviceCode}`,
                method: "PATCH",
                data: payload
            }),
            invalidatesTags: [tagTypes.estimate],
        }),
        getSingleEstimateForAnalysis: build.query({
            query: ({ code }: { code: any }) => ({
                url: `${ServiceAdvisor_URL}/get-single-estimates-for-analysis/${code}`,
                method: "GET"
            })
        }),
        

    }),
});

export const {
    useGetAllEstimatesForServiceAdvisorQuery,
    useGetSingleGeneralItemQuery,
    useGetUnassignedServiceGeneralItemQuery,
    useAssignServiceToGeneralItemMutation,
    useUpdateServiceTypeGeneralItemMutation,
    useAddPartGeneralItemMutation,
    useAddLabourGeneralItemMutation,
    useAddTechnicianGeneralItemMutation,
    useDeletePartGeneralItemMutation,
    useDeleteLabourGeneralItemMutation,
    useDeleteTechnicianPercentageGeneralItemMutation,
    useUpdatePartGeneralItemMutation,
    useUpdateLabourGeneralItemMutation,
    useUpdateTechnicianPercentageGeneralItemMutation,
    useGetSingleTireItemQuery,
    useGetUnassignedServiceTireItemQuery,
    useAssignServiceToTireItemMutation,
    useUpdateServiceTypeTireItemMutation,
    useAddPartTireItemMutation,
    useAddLabourTireItemMutation,
    useAddTechnicianTireItemMutation,
    useDeletePartTireItemMutation,
    useDeleteLabourTireItemMutation,
    useDeleteTechnicianPercentageTireItemMutation,
    useUpdatePartTireItemMutation,
    useUpdateLabourTireItemMutation,
    useUpdateTechnicianPercentageTireItemMutation,
    useGetRelatedServicesFromServiceQuery,
    useGetSingleEstimatesForServiceAdvisorQuery,
    useUpdateItemServiceStageMutation,
    useCreateReportMutation,
    useGetReportByCustomerIdQuery,
    useGetInvoiceItemQuery,
    useGetSingleInvoiceItemQuery,
    useUpdateReportMutation,
    useUpdateReportByEstimateCodeMutation,
    useSendInvoiceToUserMutation,
    useSendReportToUserMutation,
    useUpdateTireServiceMutation,
    useUpdateGeneralServiceMutation,
    useGetSingleEstimateForAnalysisQuery
} = serviceAdvisorApi;
