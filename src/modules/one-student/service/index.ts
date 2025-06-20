import axiosInstance from "@api";
import { StudentDiscount } from "@types";

// ============= GET STUDENT BY ID============
export async function getStudentById(id:number|string|undefined) {
    return (await axiosInstance.get(`api/v1/hemis/student/one?id=${id}`)).data
}

// ============= GET STUDENTS TR INFO BY PINFL============
export async function getStudentsTrInfo(params:any) {
    return (await axiosInstance.get(`api/v1/student/transaction/list`,{params})).data
}

// ============= CREATE STUDENTS DISCOUNTS ============
export async function createStudentsDiscounts(data:StudentDiscount) {
    return (await axiosInstance.post(`api/v1/discount/create`,data)).data
}

// ============= GET STUDENTS DISCOUNTS ============
export async function getStudentsDiscounts(params:any) {
    return (await axiosInstance.get(`api/v1/discount/list/pageable`,{params})).data
}

// ============= CREATE STUDENTS DISCOUNTS ============
export async function updateStudentsDiscounts(data:StudentDiscount) {
    return (await axiosInstance.put(`/api/v1/discount/update`,data)).data
}

// ============= UPLOAD STUDENTS DISCOUNTS REASON FILE ============
export async function uploadDiscountReason(data:any) {
    return (await axiosInstance.post(`api/v1/file/upload`,data)).data
}

// ============= DOWNLOAD STUDENTS DISCOUNTS REASON FILE ============
export async function downloadDiscountReason(params:any) {
    return (await axiosInstance.get(`api/v1/file/download/`,{params})).data
}



