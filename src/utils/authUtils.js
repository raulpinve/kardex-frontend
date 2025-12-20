import axios from 'axios'
import { host } from './config';

export const api = axios.create({
    baseURL: host
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})