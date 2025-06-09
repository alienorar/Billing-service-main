import axiosInstance from "@api";

//============= GET SINGLE PAYMENT GROUP LIST  ===============
export async function getOnePmtGroup(id:number|string|undefined) {
    const response = await axiosInstance.get(`api/payment-group/one/${id}`);
    return response?.data;
}
