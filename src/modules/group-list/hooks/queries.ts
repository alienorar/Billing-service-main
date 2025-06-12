import { useQuery } from "@tanstack/react-query";
import { getGroupList, getPmtGroupList } from "../service";
import { ParamsType } from "@types";

// ============ GET Group list ===========
export function useGetStudentById(params:ParamsType) {
    return useQuery({
        queryKey: ["group-list",params],
        queryFn: () => getGroupList(params)
    })
}


// ============= GET PAYMENT GROUP LIST ============
export function useGetPmtGroupList() {
    return useQuery({
        queryKey: ["payment-group"],
        queryFn: () => getPmtGroupList()
    })
}