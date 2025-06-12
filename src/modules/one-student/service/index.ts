import axiosInstance from "@api";

// ============= GET STUDENT BY ID============
export async function getStudentById(id:number|string|undefined) {
    return (await axiosInstance.get(`api/v1/hemis/student/one?id=${id}`)).data
}

// ============= GET STUDENTS TR INFO BY PINFL============
export async function getStudentsTrInfo(params:any) {
    return (await axiosInstance.get(`api/v1/student/transaction/info`,{params})).data
}

