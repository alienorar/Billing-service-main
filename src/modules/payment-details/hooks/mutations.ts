import { useMutation, useQueryClient } from "@tanstack/react-query";
import { retryTransactionHistory } from "../service";
import { openNotification } from "@utils";

// ============ CHECK TRANSACTION HISTORY ===========
export function useRetryTransactionHistory(id:number|string) {
   const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => retryTransactionHistory(id),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["transaction-history"] })
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}
