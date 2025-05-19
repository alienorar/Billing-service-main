import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getTransactionHistory } from "../service";

// ============ GET TRANSACTION HISTORY ===========
export function useGetTransactionHistory(params:ParamsType) {
    return useQuery({
        queryKey:["transaction-history",params],
        queryFn:()=> getTransactionHistory(params)
    })
}