import { useQuery } from "@tanstack/react-query";
import { getUniversityStatistics } from "../service";

export function useGetUniversityStatistics() {
    return useQuery({
        queryKey: ["university-statistics"],
        queryFn: () => getUniversityStatistics()
    })
}