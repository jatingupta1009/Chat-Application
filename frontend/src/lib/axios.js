import axios from 'axios';

export const axiosInstance= axios.create({
    baseURL: "https://chat-application-3-ruuz.onrender.com",
    withCredentials: true
})
