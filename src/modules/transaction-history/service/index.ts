import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET TR HISTORY ============
export async function getTransactionHistory(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/billing/transaction/history`,{params})).data
}

// ============= CHECK TR HISTORY ============
export async function checkTransactionHistory(id:number|string) {
    return (await axiosInstance.get(`api/v1/billing/transaction/1c/check?transactionId=${id}`)).data
}


