import axiosInstance from "@api";
import { ParamsType, SpecialityType } from "@types";

// ============= GET SPECIALITY ============
export async function getSpeciality(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/speciality/list`,{params}))
}
// ============= CREATE SPECIALITY ============
export async function createSpeciality(data:SpecialityType) {
    return (await axiosInstance.post(`api/v1/speciality/create`,data))
}
// ============= UPDATE SPECIALITY ============
export async function updateSpeciality(data:SpecialityType) {
    const response = await axiosInstance.post(`api/v1/speciality/update`, data);
    return response?.data
}
// ============= BLOCK SPECIALITY ============
export async function blockSpeciality(id:number|string) {
    return (await axiosInstance.get(`api/v1/speciality/block?id=${id}`))
}
// ============= UNBLOCK SPECIALITY ============
export async function unblockSpeciality(id:number|string) {
    return (await axiosInstance.get(`api/v1/speciality/unblock?id=${id}`))
}
// ============= GET SPECIALITY  BY ID ============
export async function getSpecialityById() {
    return (await axiosInstance.get(`api/v1/speciality/list`))
}