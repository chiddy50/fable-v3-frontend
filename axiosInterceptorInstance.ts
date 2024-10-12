import axios from 'axios';
import { deleteCookie } from 'cookies-next';

let idToken: string | null = null;
let publicAddress: string | null = null;
let appPubKey: string | null = null;

const axiosInterceptorInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Function to update headers
const updateHeaders = () => {
  if (typeof window !== 'undefined') {
    idToken = localStorage.getItem("idToken");
    publicAddress = localStorage.getItem("publicAddress");
    appPubKey = localStorage.getItem("appPubKey");

    axiosInterceptorInstance.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    axiosInterceptorInstance.defaults.headers.common['Public-Address'] = publicAddress;
    axiosInterceptorInstance.defaults.headers.common['Public-Key'] = appPubKey;
  }
};

// Call updateHeaders initially if in browser environment
if (typeof window !== 'undefined') {
  updateHeaders();
}

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Response Error interceptor: ", error);
    const message = error?.response?.data?.message;
    const errorMessages = [
      "Unauthorized",
      "Invalid token",
      "Invalid token format",
      "Token has expired",
      'jwt expired', 'jwt malformed', 'invalid signature', 'No token found'
    ];

    if (errorMessages.includes(message)) {
      console.log(message);
      deleteCookie('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user");
        localStorage.removeItem("question");
        // Consider using Next.js router for navigation instead of window.location
        // import { useRouter } from 'next/router';
        // const router = useRouter();
        // router.push('/');
      }
    }

    return Promise.reject(error);
  }
);

// Function to be called on the client-side to ensure headers are set
export const initializeAxiosHeaders = () => {
  updateHeaders();
};

export default axiosInterceptorInstance;