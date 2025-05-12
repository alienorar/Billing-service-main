import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openNotification } from "@utils";
import { syncStudentsByExel } from "../service";

// ============ CREATE ROLES ===========
export function useSyncStudents() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(data:any) => syncStudentsByExel(data),
        onSuccess:()=>{
            openNotification("success","Success","Students Synchronized");
            queryClient.invalidateQueries({queryKey:["students"]});
        },
        onError:(error) =>{
            openNotification("error","Error",error?.message)
        }
    })
}