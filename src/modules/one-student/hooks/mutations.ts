import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentDiscount } from "@types";
import { createStudentsDiscounts } from "../service";
import { openNotification } from "@utils";

// ============ CREATE ROLES ===========
export function useCreateStudentsDiscounts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:StudentDiscount) => createStudentsDiscounts(data),
        onSuccess: () => {
            openNotification("success", "Success", "Admin successfully created");
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}
