import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getSpecialityStatistics } from "../service";

export function useGetSpecialityStatistics(params: ParamsType) {
    return useQuery({
        queryKey: ["speciality-statistics", params],
        queryFn: () => getSpecialityStatistics(params)
    })
}
