import { apiClient } from "./config"
//authuntigating for signup check if the backend used register or signup
export const apiSignup = async (payload) => {
    return await apiClient.post("/users/register", payload )
}

export const apiCreateAdmin = async (payload, secret) => {
    return apiClient.post("/users/admin", payload, {
        headers: { 'x-admin-secret': secret }
    })
}
//authantigating for login
export const apiLogin = async (payload) => 
   apiClient.post("/users/login", payload )

// export const apiProfile = async () => 
//     apiClient.post("/users/profile")
