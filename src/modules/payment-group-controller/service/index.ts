import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET PAYMENT GROUP LIST ============
export async function getPmtGroupList(params:ParamsType) {
    return (await axiosInstance.get("api/payment-group/list",{params})).data
}
// ============= GET AVAILABLE GROUP LIST ============
export async function getAvailableGroupList() {
    return (await axiosInstance.get(`api/payment-group/available-groups`,)).data
}


//================ CREATE PAYMENT GROUP LIST  ===============
export async function createPmtGroupList(data:any){
    return await axiosInstance.post("api/payment-group/create",data)
}

//============= UPDATE PAYMENT GROUP LIST  ===============
export async function updatePmtGroupList(data:any) {
    const {id} = data
    const response = await axiosInstance.put(`api/payment-group/update/${id}`,data);
    return response?.data
}

//============= DELETE PAYMENT GROUP LIST  ===============
export async function deletePmtGroupList(id: number | string) {
    const response = await axiosInstance.delete(`api/payment-group/delete/${id}`);
    return response?.data;
}

//============= GET SINGLE PAYMENT GROUP LIST  ===============
export async function getOnePmtGroup(id: number | string) {
    const response = await axiosInstance.get(`api/payment-group/one/${id}`);
    return response?.data;
}

// ============= GET SPECIALITY ============
export async function getSpecialityForGroups() {
    return (await axiosInstance.get(`api/v1/speciality/form/list/all`))
}