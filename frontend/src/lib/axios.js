import axios from 'axios';

export const axiosInstance= axios.create({
    baseURL: "https://chat-application-backend-rqwp.onrender.com",
    withCredentials: true
})
