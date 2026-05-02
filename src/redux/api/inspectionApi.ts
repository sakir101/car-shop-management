import { create } from "domain";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import { get } from "http";
import { IInspectionService, IMeta } from "@/types";

const Inspection_URL = "/inspection";


export const inspectionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchInspectionItems: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${Inspection_URL}/search-inspectionItem`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: {
        tire: any;
        general: any; data: { general: any[]; tire: any[] }
      }) => {
        const combinedArray = [...response.general, ...response.tire];
        return {
          data: combinedArray,
        };
      },
      providesTags: [tagTypes.inspection],
    }),
    getInspectionAllData: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: `${Inspection_URL}/get-all-inspections`,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: IInspectionService[], meta: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.inspection],
    }),
    createInspection: build.mutation({
      query: ({ data }: { data: any }) => ({
        url: `${Inspection_URL}/create-inspection`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inspection],
    }),
    getInspection: build.query<any, string>({
      query: (code) => ({
        url: `${Inspection_URL}/get-inspection`,
        method: "POST",
        data: { code },
      }),
      providesTags: [tagTypes.inspection],
    }),
    updateInspection: build.mutation({
      query: ({ data }: { data: any }) => ({
        url: `${Inspection_URL}/update-inspection`, 
        method: "PUT",
        data,
      }),
      invalidatesTags: [tagTypes.inspection],
    }),
    deleteInspectionItem: build.mutation({
      query: ({ code }) => ({
        url: `${Inspection_URL}/remove-inspection-item/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.inspection]
    }),
    deleteInspection: build.mutation({
      query: ({ code }) => ({
        url: `${Inspection_URL}/delete-inspection/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.inspection]
    }),
    assignInspectionItem: build.mutation({
      query: ({ data }: { data: any }) => ({
        url: `${Inspection_URL}/asign-inspection-item`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inspection],
    }),
  }),

});

export const {
  useSearchInspectionItemsQuery,
  useGetInspectionAllDataQuery,
  useCreateInspectionMutation,
  useGetInspectionQuery,
  useUpdateInspectionMutation,
  useDeleteInspectionItemMutation,
  useAssignInspectionItemMutation,
  useDeleteInspectionMutation
} = inspectionApi;
