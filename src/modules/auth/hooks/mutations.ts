import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signIn} from "../service";
import { SignIn} from "../types";
import { openNotification } from "@utils";
import { setAccessToken, setUserPermissions } from "../../../utils/token-service";


export function useSignInMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: SignIn) => signIn(data),
        onSuccess: (response: any) => {
            openNotification('success', "Success", response?.data?.message);
            const access_token = response?.data?.data?.access?.accessToken;
            setAccessToken(access_token);
            const permissons = response?.data?.data.user.role.permissions
            setUserPermissions(permissons)
            // console.log(response?.data?.data?.user.role.permissions,"dbjefkjk3")
            
            navigate("/super-admin-panel/role");
        },
        onError: (error: any) => {
            openNotification('error', "Invalid username or password", error.data?.message,)

        }


    })
}


