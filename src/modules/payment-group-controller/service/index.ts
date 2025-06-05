import axiosInstance from "@api";

// ============= GET PAYMENT GROUP LIST ============
export async function getPmtGroupList() {
    return (await axiosInstance.get("api/payment-group/list")).data
}


//================ CREATE PAYMENT GROUP LIST  ===============
export async function createPmtGroupList(data:any){
    return await axiosInstance.post("api/payment-group/create",data)
}

//============= UPDATE PAYMENT GROUP LIST  ===============
export async function updatePmtGroupList(data:any) {
    const response = await axiosInstance.put(`api/v1/admin/user/update`, data);
    return response?.data
}
