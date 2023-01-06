import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";


const GetItemsBySellerId = (sellerId) => {
    return useQuery(
        ["get-items-by-seller-id", sellerId],
        () =>
            request({
                url: `item/seller/${sellerId}`,
                method: "GET",

            }),
        {
            enabled: !!sellerId,
        }
    );
};

export default GetItemsBySellerId;
