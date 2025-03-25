import { useEffect } from "react";
import useAuthStore from "../stores/AuthStore";
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_MODE === "production"
        ? import.meta.env.VITE_API_PROD_ADDRESS
        : import.meta.env.VITE_API_DEV_ADDRESS,
    withCredentials: true
});

export function APIRequest() {
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (accessToken) {
            API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        } else {
            delete API.defaults.headers.common["Authorization"];
        };
    }, [accessToken]);

    async function request(method, url, options = {}) {
        const { params = {}, data = {} } = options;
        try {
            const res = await API({ method, url, params, data });
            return res.data;
        } catch (e) {
            console.log(e);
        };
    };

    return {
        get: (url, params) => request("GET", url, { params }),
        post: (url, data) => request("POST", url, { data }),
        put: (url, data) => request("PUT", url, { data }),
        delete: (url) => request("DELETE", url)
    };
};
