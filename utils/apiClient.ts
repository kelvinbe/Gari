import axios, { AxiosResponse } from "axios";
import { getAuth } from "firebase/auth";
import { app } from "../firebase/firebaseApp";


const apiClient = axios.create({
    headers: {
        "x-user": "CUSTOMER",
        "ngrok-skip-browser-warning": "true"
    }
})

apiClient.interceptors.request.use(async (config) => {
    
    const token = await getAuth(app).currentUser?.getIdToken()
    const auth = `Bearer ${token}`

    return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: auth
        }
    }
})

apiClient.interceptors.response.use((response)=>{
    return response.data as AxiosResponse
}, (error)=>{
    return Promise.reject(error)
})

export default apiClient