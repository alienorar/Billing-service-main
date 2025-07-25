import axiosInstance from "@api";

// ============= RETRY TR HISTORY ============
export async function getPaymentChart(params:any) {
    return (await axiosInstance.get(`api/v1/payment/statistics/chart`,{params})).data
}


export async function getPaymentStatistics(params:any) {
    return (await axiosInstance.get(`api/v1/payment/statistics`,{params})).data
}
