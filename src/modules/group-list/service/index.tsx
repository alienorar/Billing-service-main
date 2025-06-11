import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET GROUP LIST ============
export async function getGroupList(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/groups/pageable`,{params})).data
}
