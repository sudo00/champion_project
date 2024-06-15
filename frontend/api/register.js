import axios from "axios"
import { err } from "react-native-svg"
import { generateImageApi } from "./baseApi"

export const registerReguset = ({username, password}) => {
    return generateImageApi.post(
        url = "/register",
        data = {
            username: username,
            password: password,
        }
    )
}