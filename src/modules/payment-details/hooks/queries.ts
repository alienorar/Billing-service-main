import { useQuery } from "@tanstack/react-query";
import { retryTransactionHistory } from "../service";

// ============ CHECK TRANSACTION HISTORY ===========
export function useRetryTransactionHistory(id:number|string) {
    return useQuery({
        queryKey:["transaction-history",id],
        queryFn:()=> retryTransactionHistory(id)
    })
}
