import { IMeta, IService } from "@/types";
import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Service_URL = "/serviceNew";


export const serviceApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllServices: build.query({
            query: (arg: Record<string, any>) => ({
                url: Service_URL,
                method: "GET",
                params: arg,
            }),
            transformResponse: (response: IService[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.service],
        }),

    }),
     
    
});


export const {
    useGetAllServicesQuery
} = serviceApi;
