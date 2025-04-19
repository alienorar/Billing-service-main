import axiosInstance from "@api";

// ============= GET STUDENT BY ID============
export async function getStudentById(id:number|string|undefined) {
    return (await axiosInstance.get(`api/v1/hemis/student/one?id=${id}`)).data
}