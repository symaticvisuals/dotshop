import { useQuery } from "react-query";
import { request } from "../config/helpers/axios-instance";



const GetAllCategories = () => {
    return useQuery(
        ["get-all-categories"],
        () =>
            request({
                url: `category`,
                method: "GET",
            })
    );
};

export default GetAllCategories;
