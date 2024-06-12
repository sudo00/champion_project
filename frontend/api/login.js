import axios from "axios"

const login = ({username, password}) => {
    axios.post(
        url = "",
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