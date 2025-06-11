import { useQuery } from "@tanstack/react-query";
import { getGroupList } from "../service";
import { ParamsType } from "@types";

// ============ GET Group list ===========
export function useGetStudentById(params:ParamsType) {
    return useQuery({
        queryKey: ["group-list",params],
        queryFn: () => getGroupList(params)
    })
}