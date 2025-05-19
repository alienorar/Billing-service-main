import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET TR HISTORY ============
export async function getTransactionHistory(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/billing/transaction/history`,{params})).data
}
