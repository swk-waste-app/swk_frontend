import { apiClient } from "./config"

// Whether the server has an Anthropic key configured; the AI features hide
// themselves when it doesn't.
export const apiAiStatus = () => apiClient.get("/ai/status")

export const apiClassifyWaste = (file) => {
    const formData = new FormData()
    formData.append("image", file)
    return apiClient.post("/ai/classify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
}

export const apiAiChat = (messages) => apiClient.post("/ai/chat", { messages })
