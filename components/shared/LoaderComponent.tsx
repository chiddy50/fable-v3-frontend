"use client";

import React from 'react'

const LoaderComponent = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center w-screen h-screen bg-white">
            {/* <i className="bx bx-loader bx-spin text-[10rem]"></i> */}
            {/* <i className='bx bxs-hourglass-top bx-flashing text-[10rem]' ></i> */}
            <div className='loader'></div>
        </div>
    )
}

export default LoaderComponent
