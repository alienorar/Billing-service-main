import { useQuery } from "@tanstack/react-query";
import { getOnePmtGroup } from "../service";

// ============= GET ONE GROUP  ============
export function useGetOneGroup(id:number|string|undefined) {
    return useQuery({
        queryKey: ["payment-group",id],
        queryFn: () => getOnePmtGroup(id)
    })
}