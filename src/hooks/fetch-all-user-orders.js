import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";


const GetUserOrders = (userId) => {
    return useQuery(
        ["get-user-orders", userId],
        () =>
            request({
                url: `order/${userId}`,
                method: "GET",

            }),
        {
            enabled: !!userId && userId !== undefined,
        }
    );
};

export default GetUserOrders;
