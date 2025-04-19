import { useQuery } from "@tanstack/react-query";
import { getAdmins, getRoles } from "../service";
import { ParamsType} from "@types";

// ============ GET ADMINS ===========
export function useGetAdmins(params:ParamsType) {
    return useQuery({
        queryKey: ["admins",params],
        queryFn: () => getAdmins(params)
    })
}

// ============ GET ROLES ===========
export function useGetRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: () => getRoles()
    })
}

