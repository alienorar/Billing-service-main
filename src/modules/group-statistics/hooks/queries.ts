import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getGroupStatistics, getStudents } from "../service";


// ============= GET GROUP STATISTICS ============
export function useGetGroupStatistics(params:ParamsType) {
    return useQuery({
        queryKey:["group-statistics",params],
        queryFn:()=> getGroupStatistics(params)
    })
}

// ============ GET STUDENTS ===========
export function useGetStudents(params: ParamsType) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
}
