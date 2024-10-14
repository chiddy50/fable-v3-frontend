"use client";
import axios from 'axios';
import React, { useEffect } from 'react'


interface Props {
    params: {
        id: string;
    };
}

const LoginSuccessPage = ({params: {id}}: Props) => {
    const decodedId = decodeURIComponent(id);
    useEffect(() => {
        authenticate()
    }, [])

    const authenticate = async () => {

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/success/${decodedId}`);
        console.log(res);
        
    }
    return (
        <div>
        
        </div>
    )
}

export default LoginSuccessPage
