import axios from "axios"

const baseURL = "https://swk-backend.onrender.com/api"

export const apiClient = axios.create({
    baseURL: baseURL,
})

// This runs before every request and always picks up the latest token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
})