import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getGroupStatistics } from "../service";


// ============= GET GROUP STATISTICS ============
export function useGetGroupStatistics(params:ParamsType) {
    return useQuery({
        queryKey:["group-statistics",params],
        queryFn:()=> getGroupStatistics(params)
    })
}