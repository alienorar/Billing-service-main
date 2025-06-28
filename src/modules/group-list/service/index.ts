import axiosInstance from "@api";
import { GroupListUpdate, ParamsType } from "@types";

// ============= GET GROUP LIST ============
export async function getGroupList(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/groups/pageable`,{params})).data
}

// ============= UPDATE GROUP LIST ============
export async function updateGroupList(data:GroupListUpdate) {
   const response =  await axiosInstance.put(`api/v1/groups/update`,data)
   return response?.data
    
}

// ============= GET PAYMENT GROUP LIST ============
export async function getPmtGroupList() {
    return (await axiosInstance.get("api/payment-group/list",)).data
}