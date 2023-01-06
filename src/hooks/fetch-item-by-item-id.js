import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";

// fetch by array of item ids
const GetItemsByItemIds = (itemIds) => {
    return useQuery(
        ["get-items-by-item-ids", itemIds],
        () =>
            request({
                url: `item/items`,
                method: "GET",
                // data: { itemIds: itemIds },
                params: { itemIds: itemIds },
            }),
        {
            enabled: !!itemIds,
        }
    );
}

export default GetItemsByItemIds;
