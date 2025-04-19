import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getPaymentHistory } from "../service";

// ============ GET PAYMENT HISTORY ===========
export function useGetPaymentHistory(params:ParamsType) {
    return useQuery({
        queryKey:["payment-history",params],
        queryFn:()=> getPaymentHistory(params)
    })
}