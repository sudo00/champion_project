import axios from "axios"
import { generateImageApi } from "./baseApi"

export const loginRequest = ({username, password}) => {
    return generateImageApi.post(
        url = "/login",
        data = {
            username: username,
            password: password,
        }
    )
}