import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";


const GetAllAddressesByUserId = (userId) => {
    return useQuery(
        ["get-addresses-by-user-id", userId],
        () =>
            request({
                url: `address/${userId}`,
                method: "GET",

            }),
        {
            enabled: !!userId,
        }
    );
};

export default GetAllAddressesByUserId;
