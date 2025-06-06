import axios from 'axios';
// import { deleteCookie } from 'cookies-next';
// import Router from 'next/router';


// const idToken = localStorage?.getItem("idToken");
// const publicAddress = localStorage?.getItem("publicAddress");
// const appPubKey = localStorage?.getItem("appPubKey");

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // Replace with your API base URL,
  // headers: {
  //   Authorization: `Bearer ${idToken}`,
  //   "Public-Address": publicAddress,
  //   "Public-Key": appPubKey
  // }
});

axiosInterceptorInstance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    const sessionStorageToken = sessionStorage.getItem('privy:token'); 
    const localStorageToken = localStorage.getItem('privy:token'); 

    const token = localStorageToken ? JSON.parse(localStorageToken) : null;
    // console.log({token});
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Handle the error
    return Promise.reject(error);
  }
);



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
      console.log("Interceptor Error Response Message: ",message);

      let errorMessages =  [
        `"exp" claim timestamp check failed`,
        "Unauthorized",
        "Invalid token",
        "Invalid token format",
        "Token has expired",
        'jwt expired', 'jwt malformed', 'invalid signature', 'No token found'
      ]
      if (errorMessages.includes(message)) {
        console.log(`Logout now: ${message}`);
        sessionStorage.removeItem("privy:token") 
        sessionStorage.removeItem("user") 
        localStorage.removeItem("privy:token") 
        localStorage.removeItem("user") 
        
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHRnZGFhenAwMDAwNWV6eXg5ZDU2d24xIiwibmFtZSI6ImhlbnJ1IiwiaWF0IjoxNzEwMjg0MjM1LCJleHAiOjE3MTAyODc4MzV9.iXn4sTg-PX0bP8htey9W6K4UVf-
        // window.location.reload();
        const pathIsDashboard = window.location.pathname.startsWith("/dashboard/");
        console.log({pathname: window.location.pathname, location: window.location, pathIsDashboard});
        // window.location.href = '/';

        const path = window.location.pathname !== "/"
        console.log({
          pathIsDashboard,
          path
        });
        

        if (window.location.pathname !== "/" && pathIsDashboard) {          
          window.location.href = '/';
          // window.location.reload();
        }
      }

      return Promise.reject(error);
    }
  );
  // End of Response interceptor
  
  export default axiosInterceptorInstance;