import axiosInstance from "@api";

export async function getUniversityStatistics () {
    return (await  axiosInstance.get("api/v1/university/statistics")).data
}
