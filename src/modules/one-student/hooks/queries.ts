import { useQuery } from "@tanstack/react-query";
import { getStudentById, getStudentsTrInfo } from "../service";

// ============ GET ADMINS ===========
export function useGetStudentById(id:number | string |undefined ) {
    return useQuery({
        queryKey: ["student",id],
        queryFn: () => getStudentById(id)
    })
}

// ============= GET GROUP STATISTICS ============
export function useGetStudentsTrInfo(params:any) {
    return useQuery({
        queryKey:["students",params],
        queryFn:()=> getStudentsTrInfo(params)
    })
}
