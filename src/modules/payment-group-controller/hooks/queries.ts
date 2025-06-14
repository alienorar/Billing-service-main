import { useQuery } from "@tanstack/react-query";
import { getAvailableGroupList,  getPmtGroupList, getSpecialityForGroups } from "../service";
import { ParamsType } from "@types";

// ============= GET PAYMENT GROUP LIST ============
export function useGetPmtGroupList(params:ParamsType) {
    return useQuery({
        queryKey: ["payment-group",params],
        queryFn: () => getPmtGroupList(params)
    })
}
// ============= GET GROUP LIST ============
export function useGetAvailabletGroupList() {
    return useQuery({
        queryKey: ["payment-group"],
        queryFn: () => getAvailableGroupList()
    })
}


// ============= GET GROUP LIST ============
export function useGetSpecialityForGroups() {
    return useQuery({
        queryKey: ["payment-group"],
        queryFn: () => getSpecialityForGroups()
    })
}
