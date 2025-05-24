import axiosInstance from "@api";

// ============= RETRY TR HISTORY ============
export async function retryTransactionHistory(id:number|string) {
    return (await axiosInstance.post(`/api/v1/billing/transaction/1c/retry?id=${id}`)).data
}
