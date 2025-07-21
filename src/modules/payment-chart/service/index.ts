import axiosInstance from "@api";

// ============= RETRY TR HISTORY ============
export async function getPaymentChart(params:any) {
    return (await axiosInstance.get(`api/v1/payment/statistics/chart`,{params})).data
}
