import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET PYT HISTORY ============
export async function getXaznaHistory(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/payment/history/xazna`,{params})).data
}