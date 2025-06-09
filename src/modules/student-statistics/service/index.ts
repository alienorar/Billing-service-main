import axiosInstance from "@api";

// ============= GET ST STATISTICS ============
export async function getStudentStatistics() {
    return (await axiosInstance.get(`api/v1/statistics/student`)).data
}