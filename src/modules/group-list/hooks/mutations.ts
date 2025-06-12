import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupList } from "../service";
import { openNotification } from "@utils";
import { GroupListUpdate } from "@types";


// ============ UPDATE GROUP LIST ===========
export function useUpdateGroupList () {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:GroupListUpdate) => updateGroupList(data),
         onSuccess: (data) => {
                    openNotification("success", "Success", data?.data?.message)
                },
                onSettled: (_, error) => {
                    if (error) {
                        openNotification("error", "Error", error?.message)
                    } else {
                        queryClient.invalidateQueries({ queryKey: ["group-list"] })
                    }
                }
    })
} 