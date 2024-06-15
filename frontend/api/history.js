import { generateImageApi } from "./baseApi"

export const historyRequest = () => {
    return generateImageApi.get(
        {
            url: "/history",
        }
    )
}