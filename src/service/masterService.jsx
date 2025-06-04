import axiosInstance from "./Axios";

// Get all masters
export const getAllMasters = async () => {
    try {
        const response = await axiosInstance.get("/masters");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get master by ID
export const getMasterById = async (id) => {
    try {
        const response = await axiosInstance.get(`/masters/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new master
export const createMaster = async (masterData) => {
    try {
        const response = await axiosInstance.post("/masters", masterData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update a master
export const updateMaster = async (id, masterData) => {
    try {
        const response = await axiosInstance.put(`/masters/${id}`, masterData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a master
export const deleteMaster = async (id) => {
    try {
        const response = await axiosInstance.delete(`/masters/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update master online status
export const updateMasterOnlineStatus = async (id, isOnline) => {
    try {
        const response = await axiosInstance.patch(`/masters/${id}/online-status`, { isOnline });
        return response.data;
    } catch (error) {
        throw error;
    }
};