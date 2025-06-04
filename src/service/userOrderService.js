import axiosInstance from "./Axios"

// Get all user orders
export const getUserOrders = async () => {
    try {
        const response = await axiosInstance.get("/user-orders")
        return response.data
    } catch (error) {
        throw error
    }
}

// Get single user order by ID
export const getUserOrderById = async (id) => {
    try {
        const response = await axiosInstance.get(`/user-orders/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

// Update user order
export const updateUserOrder = async (id, orderData) => {
    try {
        const response = await axiosInstance.patch(`/user-orders/${id}`, orderData)
        return response.data
    } catch (error) {
        throw error
    }
}

// Cancel user order
export const cancelUserOrder = async (id) => {
    try {
        const response = await axiosInstance.patch(`/user-orders/${id}/cancel`)
        return response.data
    } catch (error) {
        throw error
    }
}
