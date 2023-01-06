import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";


const GetSellerItemOrder = (sellerId) => {
    return useQuery(
        ["get-seller-item-orders", sellerId],
        () =>
            request({
                url: `cartItem/seller/${sellerId}`,
                method: "GET",

            }),
        {
            enabled: !!sellerId,
        }
    );
};

export default GetSellerItemOrder;
