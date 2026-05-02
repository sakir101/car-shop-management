import { IMeta } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const createContract_URL = "/contract";

export const createContractApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createContract: build.mutation({
      query: (data) => ({
        url: `${createContract_URL}/create-contract`,
        method: "POST",
        data,
        contentType:'multipart/form-data'
      }),
      invalidatesTags: [tagTypes.contract],
    }),
    getAllContract: build.query({
      query: (arg: Record<string, any>) => ({
        url: `${createContract_URL}/`,
        method: "GET",
        params: arg,
      }),
      transformResponse: (response, meta: IMeta) => ({
        items: response,
      }),
      providesTags: [tagTypes.contract],
    }),
    getSingleContact: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `${createContract_URL}/single-contact/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.contract],
    }),
    updateSingleContact: build.mutation({
      query: ({ id, data }) => ({
        url: `${createContract_URL}/single-contact/${id}`,
        method: "PATCH",
        data,
        contentType:'multipart/form-data'
      }),
      invalidatesTags: [tagTypes.contract],
    }),
    deleteContractById: build.mutation({
      query: (id: string) => ({
        url: `${createContract_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.contract],
    }),
  }),
});

export const {
  useCreateContractMutation,
  useDeleteContractByIdMutation,
  useGetAllContractQuery,
  useGetSingleContactQuery,
  useUpdateSingleContactMutation,
} = createContractApi;
