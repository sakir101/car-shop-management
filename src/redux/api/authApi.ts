import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"

const Auth_URL = "/auth"
export const authApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (loginData) => ({
                url: `${Auth_URL}/login`,
                method: "POST",
                data: loginData
            }),
            invalidatesTags: [tagTypes.user]
        }),
    }),
})

export const { useUserLoginMutation } = authApi