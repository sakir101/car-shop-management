import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"


const Admin_URL = "/admin"

export const adminApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        getSingleAdmin: build.query({
            query: (id: string | string[] | undefined) => ({
                url: `/user/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.admin],
        }),

    })

})

export const {
    useGetSingleAdminQuery
} = adminApi