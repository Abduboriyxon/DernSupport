import axiosInstance from "./Axios";

// Get user profile
export const getProfile = async () => {
    try {
        const response = await axiosInstance.get("/profiles");
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};

// Update user profile
export const updateProfile = async (profileData) => {
    try {
        const response = await axiosInstance.patch("/profiles/update", profileData);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};


// Request password change
export const requestPasswordChange = async (passwordData) => {
    try {
        const response = await axiosInstance.post("/profiles/change-password", passwordData);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};

// Verify password change
export const verifyPasswordChange = async (verificationData) => {
    try {
        const response = await axiosInstance.post("/profiles/verify-password-change", verificationData);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};

// Request email change
export const requestEmailChange = async (emailData) => {
    try {
        const response = await axiosInstance.post("/profiles/change-email", emailData);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};

// Verify email change
export const verifyEmailChange = async (verificationData) => {
    try {
        const response = await axiosInstance.post("/profiles/verify-email-change", verificationData);
        return response.data;
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            throw new Error("Cannot connect to the server. Please ensure the backend is running.");
        }
        throw error;
    }
};