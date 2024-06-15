import axios from "axios"
import { err } from "react-native-svg"

export const register = ({username, password}) => {
    axios.post(
        url = "http://backend:4000/register",
        data = {
            username: username,
            password: password,
        }
    ).then((response) => {
        console.log(response)
    }).catch((error) => {
        console.log(error)
    })
}