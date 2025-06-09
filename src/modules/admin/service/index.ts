import axiosInstance from "@api";
import { AdminsResponse, AdminType, ParamsType} from "@types";

//================ GET ADMINS ===============
export async function getAdmins(params: ParamsType): Promise<AdminsResponse> {
    return (await axiosInstance.get(`api/v1/admin/user/list`,{ params })).data;
}

//================ GET ROLES FOR SELECTION ===============
export async function getRoles() {
    return await axiosInstance.get(`api/v1/role/list`);
}

//================ CREATE RADMINS ===============
export async function createAdmins(data:AdminType): Promise<AdminsResponse> {
    return await axiosInstance.post("api/v1/admin/user/create",data)
}

//============= UPDATE ADMINS ===============
export async function updateAdmins(data:AdminType) {
    const response = await axiosInstance.put(`api/v1/admin/user/update`, data);
    return response?.data
}

//============= DELETE ADMINS ===============
export async function deleteAdmins(id: number | string) {
    const response = await axiosInstance.delete(`api/v1/admin/user/delete`, {
        params: { id } 
    });
    return response?.data;
}
