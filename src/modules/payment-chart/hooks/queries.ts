import { useQuery } from "@tanstack/react-query";
import { getPaymentChart, getPaymentStatistics } from "../service";

// ============ GET PAYMENT HISTORY ===========
export function useGetPaymentChart(params:any) {
    return useQuery({
        queryKey:["payment-chart",params],
        queryFn:()=> getPaymentChart(params)
    })
}


export function useGetPaymentStatistics(params:any){
    return useQuery({
        queryKey: ["payment-statistics", params],
        queryFn: ()=> getPaymentStatistics(params)

    })
}