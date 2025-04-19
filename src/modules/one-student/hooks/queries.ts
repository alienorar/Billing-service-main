import { useQuery } from "@tanstack/react-query";
import { getStudentById } from "../service";

// ============ GET ADMINS ===========
export function useGetStudentById(id:number | string |undefined ) {
    return useQuery({
        queryKey: ["student",id],
        queryFn: () => getStudentById(id)
    })
}