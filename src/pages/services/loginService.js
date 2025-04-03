import axios from 'axios'

const loginService = (data) => {
    const request = axios.post('http://localhost:3001/login', data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {loginService}