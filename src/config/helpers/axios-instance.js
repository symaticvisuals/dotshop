import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "./baseURL";


const client = axios.create({
    baseURL: getApiURL(),
    headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
    },
});
export const request = ({ ...options }) => {
    const onSuccess = (response) => {
        return response;
    };
    const onError = (error) => {
        return error;
    };
    return client(options).then(onSuccess).catch(onError);
};
