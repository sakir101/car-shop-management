import { IInspection, IMeta } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const inspectionGroup_URL = "/inspection-group";

export const inspectionGroupApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createInspectionGroup: build.mutation({
      query: ({ data }: { data: any }) => ({
        url: `${inspectionGroup_URL}/create-inspection-group`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    assignInspectionToGroup: build.mutation({
      query: ({ code, data }) => ({
        url: `${inspectionGroup_URL}/assign-inspections/${code}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    addInspectionHours: build.mutation({
      query: ({ code, data }) => ({
        url: `${inspectionGroup_URL}/add-inspection-hours/${code}`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    getInspectionGroupByCode: build.query({
      query: (code) => ({
        url: `${inspectionGroup_URL}/get-inspection-group/${code}`,
        method: "GET",
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
    getAllInspectionsFromGroup: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${inspectionGroup_URL}/get-all-inspections-from-group`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response: IInspection[], meta: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
    getUnassignInspections: build.query({
      query: ({ args, code }: { args?: Record<string, any>, code: string }) => ({
        url: `${inspectionGroup_URL}/get-unassign-inspections/${code}`,
        method: "GET",
        params: args,
      }),
      transformResponse: (response: IInspection[], meta: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
    getAssignedInspections: build.query({
      query: ({ args, code }: { args?: Record<string, any>; code: string }) => ({
        url: `${inspectionGroup_URL}/get-assign-inspections/${code}`,
        method: "GET",
        params: args
      }),
      transformResponse: (response: IInspection[], meta: IMeta) => ({
        data: response,
        meta,
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
    getInspectionHours: build.query({
      query: (inspectionGroupCode) => ({
        url: `${inspectionGroup_URL}/get-inspection-hours/${inspectionGroupCode}`,
        method: "GET",
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
    updateInspectionGroup: build.mutation({
      query: ({ code, data }) => ({
        url: `${inspectionGroup_URL}/update-inspection-group/${code}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    updateInspectionHours: build.mutation({
      query: ({ inspectionGroupCode, inspectionHoursId, data }) => ({
        url: `${inspectionGroup_URL}/update-inspection-hour/${inspectionGroupCode}/${inspectionHoursId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    deleteInspectionHoursToGroup: build.mutation({
      query: ({ inspectionGroupCode, inspectionHoursId }) => ({
        url: `${inspectionGroup_URL}/delete-inspection-hour/${inspectionGroupCode}/${inspectionHoursId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    deleteInspectionGroup: build.mutation({
      query: ({ code }) => ({
        url: `${inspectionGroup_URL}/delete-inspection-group/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    unassignInspection: build.mutation({
      query: ({ inspectionGroupCode, inspectionCode }) => ({
        url: `${inspectionGroup_URL}/unassign-inspection/${inspectionGroupCode}/${inspectionCode}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.inspectionGroup],
    }),
    getInspectionGroup: build.query({
      query: (query) => ({
        url: `${inspectionGroup_URL}/get-all-inspectionGroup`,
        method: "GET",
        params: query,
      }),
      providesTags: [tagTypes.inspectionGroup],
    }),
  }),
});

export const {
  useCreateInspectionGroupMutation,
  useAssignInspectionToGroupMutation,
  useAddInspectionHoursMutation,
  useGetInspectionGroupByCodeQuery,
  useGetAllInspectionsFromGroupQuery,
  useGetUnassignInspectionsQuery,
  useGetAssignedInspectionsQuery,
  useGetInspectionHoursQuery,
  useUpdateInspectionGroupMutation,
  useUpdateInspectionHoursMutation,
  useDeleteInspectionHoursToGroupMutation,
  useUnassignInspectionMutation,
  useGetInspectionGroupQuery,
  useDeleteInspectionGroupMutation
} = inspectionGroupApi;
