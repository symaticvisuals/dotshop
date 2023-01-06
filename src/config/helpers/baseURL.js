const getBaseURL = () => {
    if (process.env.REACT_APP_ENV === "local") {
        return process.env.REACT_APP_BASE_URL_LOCAL;
    }
    switch (process.env.NODE_ENV) {
        case "development":
            return process.env.REACT_APP_BASE_URL_DEV;
        case "prod":
            return process.env.REACT_APP_BASE_URL_PROD;
        default:
            return "http://192.168.29.244:3005/api/";
    }
};

export const getApiURL = (url) => {
    if (url) {
        return getBaseURL() + url;
    }
    return getBaseURL();
};
