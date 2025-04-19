import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getStudents } from "../service";

// ============ GET ADMINS ===========
export function useGetStudents(params:ParamsType) {
    return useQuery({
        queryKey:["students",params],
        queryFn:()=> getStudents(params)
    })
}