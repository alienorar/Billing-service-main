import { useMutation, useQueryClient } from "@tanstack/react-query"
import { RoleType } from "@types"
import { createRoles, updateRoles } from "../service"
import { openNotification } from "@utils"

// ============ CREATE ROLES ===========
export function useCreateRoles() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: RoleType) => createRoles(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["roles"] })
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}


// ============ UPDATE ROLES ===========
export function useUpdateRoles() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: RoleType) => updateRoles(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
        },
        onSettled: (_, error) => {
            if (error) {
                openNotification("error", "Error", error?.message)
            } else {
                queryClient.invalidateQueries({ queryKey: ["roles"] })
            }
        }
    })

}


