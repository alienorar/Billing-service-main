import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DebtRecord } from "@types";
import { createDebtList, deactivateDebt, updateDebtList, uploadDebtReason } from "../service";
import { openNotification } from "@utils";

// ============ CREATE ROLES ===========
export function useCreateDebtList() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: DebtRecord) => createDebtList(data),
        onSuccess: () => {
            openNotification("success", "Success", "Chegirma successfully created");
            queryClient.invalidateQueries({ queryKey: ["debt"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ Update student discount ===========
export function useUpdateDebtList() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:DebtRecord) => updateDebtList(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["debt"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ upload discount reason file  ===========
export function useUploadDebtReason() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => uploadDebtReason(data),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

export function useDeactivateDebt() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id:number|string) =>deactivateDebt(id),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
        },
        onSettled: (_, error) => {
            if (error) {
                openNotification("error", "Error", error?.message)
            } else {
                queryClient.invalidateQueries({ queryKey: ["debt"] })
            }
        }
    })

}
