import axios from 'axios';
import { host } from '../../utils/config';

const loginService = (data) => {
    const request = axios.post(`${host}/login`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {loginService}