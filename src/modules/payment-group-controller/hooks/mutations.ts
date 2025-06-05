import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openNotification } from "@utils";
import { createPmtGroupList } from "../service";

// ============ CREATE PM GROUP LIST  ===========
export function useCreateAdmin() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:any) => createPmtGroupList(data),
        onSuccess: () => {
            openNotification("success", "Success", "Admin successfully created");
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ UPDATE PM GROUP LIST  ===========
 

// update funsiyani yoz 