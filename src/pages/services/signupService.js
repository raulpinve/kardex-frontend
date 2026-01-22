import axios from 'axios'
import { host } from '../../utils/config'

const signUpService = (data) =>{
    const request = axios.post(`${host}/auth/signup`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {signUpService}