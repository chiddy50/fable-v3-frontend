'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';

export default function StoryHeader() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		// Trigger animation after component mount
		setLoaded(true);
	}, []);

	return (
		<div className="relative w-full">
			{/* Story Container */}
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				{/* Hero Image Section with White Fade */}
				<div className="relative h-80">
					{/* Background Image */}
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: "url('/img/placeholder.png')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
							// backgroundPosition: 'center top'
						}}
					/>

					{/* White Fade Overlay - Bottom */}
					<div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

					{/* White Fade Overlay - Left & Right */}
					<div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent opacity-40" />
					<div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent opacity-40" />

					{/* Close Button */}
					<button className="absolute top-4 left-4 rounded-full bg-gray-800 bg-opacity-40 p-2 text-white hover:bg-opacity-60 transition-all">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>

					{/* Original Tag */}
					<div className="absolute top-4 right-4">
						<span className="inline-block bg-white text-red-600 font-medium text-xs px-4 py-2 rounded-lg">
							Original
						</span>
					</div>
				</div>

				{/* Story Info Section */}
				<div className="px-6 pb-6">
					{/* Logo and Title */}
					<div className=" mt-4">
						<div className="mr-4 flex-shrink-0">
							<div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md">
								<img
									src="/img/placeholder.png"
									alt="Story logo"
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
						<h1 className="text-5xl font-bold text-gray-800 mt-3">Hallow Pot</h1>
					</div>

					{/* Author Info */}
					<div className="flex items-center justify-between mt-6 pb-4 border-b border-gray-200">
						<div className="flex items-center">
							<div className=" overflow-hidden mr-2">
								{/* <img
									src="/api/placeholder/40/40"
									alt="Author avatar"
									className="w-full h-full object-cover"
								/> */}
								<UserAvatarComponent
									width={40} 
									height={40} 
									borderRadius='rounded-lg'            
									imageUrl={"/avatar/default-avatar.png"}
									border="border border-white"
								/>
							</div>
							<span className="text-gray-600 text-sm font-medium">@ColePalmer</span>
						</div>

						<div className="flex items-center text-gray-600">

							<span className="mx-2 text-xs"><span className='font-bold'>5min read</span> • 20min ago</span>

						</div>
					</div>

					{/* Engagement Stats */}
					<div className="flex items-center justify-between mt-4">
						<div className="flex items-center">
							<button className="flex items-center mr-4">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
								</svg>
								<span className="ml-1">20</span>
							</button>
						</div>

						<div className="flex items-center space-x-4">
							<button>
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="18" cy="5" r="3" />
									<circle cx="6" cy="12" r="3" />
									<circle cx="18" cy="19" r="3" />
									<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
									<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
								</svg>
							</button>

							<div className="flex items-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="gold" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
								<span className="ml-1 text-gray-700">4/5</span>
							</div>
						</div>
					</div>

					{/* Enhancing the white fade with additional content */}
					<div className="mt-6 opacity-0 animate-fadeIn" style={{
						animation: loaded ? 'fadeIn 0.5s ease-in-out forwards 0.3s' : 'none'
					}}>
						{/* This content would continue below the white fade */}
						<div className="text-sm text-gray-500">
							More content would appear here...
						</div>
					</div>
				</div>
			</div>

			{/* Global styles for animations */}
			<style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</div>
	);
}