import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openNotification } from "@utils";
import { createPmtGroupList, deletePmtGroupList, updatePmtGroupList } from "../service";

// ============ CREATE PM GROUP LIST  ===========
export function useCreatePmtGroupList() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:any) => createPmtGroupList(data),
        onSuccess: () => {
            openNotification("success", "Success", "Payment group successfully created");
            queryClient.invalidateQueries({ queryKey: ["payment-group"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ UPDATE PM GROUP LIST  ===========
 export function useUpdatePmtGroupList() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:any) => updatePmtGroupList(data),
        onSuccess: () => {
            openNotification("success", "Success", "Payment group successfully updated");
            queryClient.invalidateQueries({ queryKey: ["payment-group"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

//============= DELETE PAYMENT GROUP LIST  ===============
 export function useDeletePmtGroupList() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id:any) => deletePmtGroupList(id),
        onSuccess: () => {
            openNotification("success", "Success", "Payment group successfully deleted");
            queryClient.invalidateQueries({ queryKey: ["payment-group"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}



