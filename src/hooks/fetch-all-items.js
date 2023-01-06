import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";



const GetAllItems = () => {
    return useQuery(
        ["get-all-items"],
        () =>
            request({
                url: `item`,
                method: "GET",
            })
    );
};

export default GetAllItems;
