import { host } from './config'
import axios from 'axios'

export const apiClient = (token) => {
    return axios.create({
        baseURL: host,
        headers: {
            Authorization: `Bearer ${token}`, 
        }
    })
}