import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Inspection_URL = "/inspection";

export const inspectionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // inspection section
    getAllInspection: build.query({
      query: () => ({
        url: `${Inspection_URL}/all-inspection`,
        method: "GET",
      }),
      providesTags: [tagTypes.inspection],
    }),

    getInspectionByCode: build.query({
      query: (InspectionCode) => ({
        url: `${Inspection_URL}/single/${InspectionCode}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response;
      },
      providesTags: [tagTypes.getInspectionByCode],
    }),

    searchInspection: build.mutation({
      query: (query, page = 1, limit = 10) => ({
        url: `/service/get-all-inspections?searchTerm=${query}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      invalidatesTags: [tagTypes.searchInspection],
    }),
  }),
});

export const {
  useGetAllInspectionQuery,
  useGetInspectionByCodeQuery,
  useSearchInspectionMutation,
} = inspectionApi;
