export const getBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL ||"https://myapi.zhoopzhoopauto.com/api/v1"
}