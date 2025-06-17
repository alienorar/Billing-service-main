import axios from "axios";
import { getAccessToken, } from "../utils/token-service";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const access_token = getAccessToken();
    if (access_token) {
        config.headers["x-admin-token"] = access_token;
    }
    return config;
});

export default axiosInstance;
