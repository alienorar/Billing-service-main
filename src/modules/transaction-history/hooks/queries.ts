import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { checkTransactionHistory, getTransactionHistory } from "../service";

// ============ GET TRANSACTION HISTORY ===========
export function useGetTransactionHistory(params:ParamsType) {
    return useQuery({
        queryKey:["transaction-history",params],
        queryFn:()=> getTransactionHistory(params)
    })
}

// ============ CHECK TRANSACTION HISTORY ===========
export function useCheckTransactionHistory(id:number|string) {
    return useQuery({
        queryKey:["transaction-history",id],
        queryFn:()=> checkTransactionHistory(id)
    })
}

