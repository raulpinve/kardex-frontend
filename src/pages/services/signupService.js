import axios from 'axios'

const signUpService = (data) =>{
    const request = axios.post('http://localhost:3000/signup', data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {signUpService}