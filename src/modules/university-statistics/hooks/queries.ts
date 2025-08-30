import { useQuery } from "@tanstack/react-query";
import { getDebtRate, getUniversityStatistics } from "../service";
import { ParamsType } from "@types";

export function useGetUniversityStatistics() {
    return useQuery({
        queryKey: ["university-statistics"],
        queryFn: () => getUniversityStatistics()
    })
}

// =========================GET++++++++++++++++++++++++
export function useGetDebtRate(params:ParamsType) {
    return useQuery({
        queryKey: ["debt-rate",params],
        queryFn: () => getDebtRate(params)
    })
}