import axiosInstance from "@api";

// ============= GET STUDENTS ============
export async function getStudents(params:any) {
    return (await axiosInstance.get(`api/v1/hemis/student/list`,{params})).data
}
