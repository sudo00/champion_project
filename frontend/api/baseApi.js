import axios from "axios";

export const BACKEND_URL = "http://localhost:4000"
export const generateImageApi = axios.create(
    {
        baseURL: BACKEND_URL,
    }
)