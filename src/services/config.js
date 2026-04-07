import axios from "axios"

const baseURL = "http://localhost:6060/api"

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