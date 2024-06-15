import { generateImageApi } from "./baseApi"

export const TASK_TYPE_IMAGE = "image"
export const TASK_TYPE_BANNER = "banner"
export const TASK_TYPE_INPAINT = "inpaint"

export const generateRequest = ({
    taskType, taskData
}) => {
    return generateImageApi.post(
        url = "/generate",
        data = {
            type: taskType,
            options: taskData,
        }
    )
}
