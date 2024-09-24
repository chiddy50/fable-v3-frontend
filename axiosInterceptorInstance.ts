import axios from 'axios';
import { deleteCookie } from 'cookies-next';
// import Router from 'next/router';

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your API base URL
});


// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
    (response) => {
      // Modify the response data here  
      return response;
    },
    (error) => {
      // Handle response errors here
      console.log("Response Error interceptor: ",error);
      let message = error?.response?.data?.message
      let errorMessages =  [
        "Unauthorized",
        "Invalid token",
        "Invalid token format",
        "Token has expired",
        'jwt expired', 'jwt malformed', 'invalid signature', 'No token found'
      ]
      if (errorMessages.includes(message)) {
        console.log(message);
        deleteCookie('token')
        localStorage.removeItem("user") 
        localStorage.removeItem("question")
        
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHRnZGFhenAwMDAwNWV6eXg5ZDU2d24xIiwibmFtZSI6ImhlbnJ1IiwiaWF0IjoxNzEwMjg0MjM1LCJleHAiOjE3MTAyODc4MzV9.iXn4sTg-PX0bP8htey9W6K4UVf-
        // window.location.reload();

        // window.location.href = '/';
      }

      return Promise.reject(error);
    }
  );
  // End of Response interceptor
  
  export default axiosInterceptorInstance;