import { useQuery } from "@tanstack/react-query";
import { getPmtGroupList } from "../service";

// ============= GET PAYMENT GROUP LIST ============
export function useGetPmtGroupList() {
    return useQuery({
        queryKey: ["payment-group"],
        queryFn: () => getPmtGroupList()
    })
}