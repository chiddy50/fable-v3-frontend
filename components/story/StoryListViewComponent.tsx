'use client';
import Image from 'next/image';
import AuthorComponent from '@/components/story/AuthorComponent';
import BookmarkComponent from '@/components/shared/BookmarkComponent';
import CommentBtnComponent from '@/components/shared/CommentBtnComponent';
import ShareBtnComponent from '@/components/shared/ShareBtnComponent';
import RatingBtnComponent from '@/components/shared/RatingBtnComponent';
import Link from 'next/link';

const StoryListViewComponent = ({ image, authorCount, story }: { image: string, authorCount: number, story: any }) => {

	return (
		
		<div className="max-w-4xl mx-auto mb-8 font-sans">
			<div className="flex flex-col md:flex-row gap-6">
				{/* Story Image Section */}
				<div className="relative w-full md:w-2/5 rounded-2xl overflow-hidden">
					<div className="absolute top-4 left-4 z-10 bg-black/50 text-white font-semibold px-2 py-1 rounded-md text-xs">
						5min
					</div>
					<div className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
					</div>
					{/* <Image
						src={`${image}`}
						alt="The deathly hallows of North Seria"
						fill
						className="object-cover"
					/> */}
					<img
						src={`${image}`}
						alt="story cover image"
						// fill
						className="object-cover rounded-xl h-full"
					/>
				</div>

				{/* Story Content Section */}
				<div className="flex-1">
					{/* Author Section */}
					<AuthorComponent count={1} name={story?.user?.name} publishedAt={story?.publishedAt} />

					{/* Story Title and Preview */}
					<Link href="/read-story">
						<h1 className="text-xl font-bold text-gray-800 mb-3 hover:underline">{story?.projectTitle}</h1>
					</Link>
					<div className="text-gray-600 mb-6 text-xs">
						<p>{story?.overview?.slice(0, 200)}...</p>
					</div>

					{/* Tags */}
					<div className="flex items-center gap-2 ">
						{
							story.genres.map((genre: string) => (
								<span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">{genre}</span>
							))
						}
					</div>

					{/* Interaction Buttons */}
					<div className="flex items-center flex-wrap gap-3 relative mt-6">
						<BookmarkComponent />
						<CommentBtnComponent />
						<ShareBtnComponent />
						<RatingBtnComponent />
					</div>

				</div>
			</div>
		</div>

	);
};

export default StoryListViewComponent;








