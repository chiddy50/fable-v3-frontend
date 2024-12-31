'use client';

import { combineName } from '@/lib/utils';
import { useEffect, useState } from 'react';

import Editor from '@/components/editor/editor';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Bookmark,
  Ellipsis,
  MessageSquare,
  Share,
  Share2,
  Star,
  ThumbsUp
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDate, hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { ArticleInterface } from '@/interfaces/ArticleInterface';
import BlockRenderer from '../EditorJs/BlockRenderer';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ArticleComponent({ slug }: { slug: string }) {

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [liking, setLiking] = useState<boolean>(false);
    const [article, setArticle]= useState<ArticleInterface|null>(null);   
    const [accessRecord, setAccessRecord]= useState(null);   
    const [userArticleRating, setUserArticleRating]= useState(null);   
    const [userLike, setUserLike]= useState(null);   
    

    useEffect(() => {
        getArticle();
    }, []);

    const getArticle = async () => {
        try {
            setIsFetching(true);
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/articles/read/${slug}`)
            console.log(response);
            
            setArticle(response?.data?.article);
            setAccessRecord(response?.data?.accessRecord);
            setUserArticleRating(response?.data?.userArticleRating);
            setUserLike(response?.data?.userLike);
        } catch (error) {
            console.error(error);            
        }finally{
            setIsFetching(false);
        }
    }

    const likePost = async ({ id }: { id: string }) => {
        if(liking) return;

        setLiking(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${id}/like`;
            const response = await axiosInterceptorInstance.put(url, {});
            await getArticle();            
        } catch (error) {
            console.error(error);      
        }finally{
            setLiking(false);
        }
    }


    const fetchArticlesCategories = async () => {
        try {
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/articles/tags`)
            console.log(response);

        } catch (error) {
            console.error(error);            
        }
    }

    const onAction = () => {
        
    }

    const shareArticle = async () => {
        const url = `https://usefable.xyz/articles/${article?.id}`;        
        const message = `Read my latest article on Fable!  `;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${message} ${encodeURIComponent(` \n\n ${url} \n\n #fable @meta_fable @getcode`)}`;
        window.open(twitterUrl, '_blank');
    }

    const handleRatingChange = async (newRating: number) => {        
        try {
            showPageLoader();
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${article?.id}/rate`;
            const response = await axiosInterceptorInstance.put(url, 
                {
                    rating: newRating
                }
            );
            await getArticle();

            toast.success("Article rated")
            
        } catch (error) {
            console.error(error);      
        }finally{
            hidePageLoader();
        }
    };
    

    if (!article) {
        return (
            <section className='pb-24 pt-32 sm:pt-40'>
                <div className='container flex max-w-3xl items-center justify-center'>
                    <Spinner size='lg' />
                </div>
            </section>
        )
    }

    return (
        <section className='pb-24 pt-32 sm:pt-40'>
            <div className='container max-w-3xl'>
                <h1 className='text-4xl font-bold'>{article?.title}</h1>
                <p className='mt-3 text-muted-foreground'>{article?.excerpt}</p>

                {/* Author */}
                <div className='mt-6 inline-flex items-center gap-3'>
                    <Link href={`/author/${article.userId}`}>                    
                        <Avatar>
                            <AvatarImage
                            src={article?.user?.imageUrl}
                            alt={combineName(article?.user)}
                            />
                            <AvatarFallback>{article?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div>
                        <Link href={`/author/${article.userId}`}>
                            <h2 className=''>{combineName(article?.user)}</h2>
                        </Link>
                        <p className='text-sm font-light text-muted-foreground'>
                        {formatDate(article.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Metadata */}
                <div className='mt-6 flex w-full items-center justify-between border-b border-t px-4 py-3'>
                    <div className='flex items-center space-x-6'>
                        <button
                        disabled={liking}
                        className='flex items-center gap-2 font-light text-muted-foreground hover:text-foreground'
                        onClick={async () => await likePost({ id: article.id })}
                        >
                            {/* <ThumbsUp className='size-5 cursor-pointer text-green-500' strokeWidth={1.5} /> */}
                            { userLike && <i className='bx bxs-like cursor-pointer text-xl text-green-500'></i> }
                            { !userLike && <i className='bx bx-like cursor-pointer text-xl text-green-500'></i> }
                            <span>{article?.likeCount}</span>
                        </button>

                        <button className='flex items-center gap-2 font-light text-muted-foreground hover:text-foreground'>
                            <MessageSquare className='size-5' strokeWidth={1.5} />
                            <span>0</span>
                        </button>
                    </div>

                    <div className='flex items-center space-x-4'>
                        {/* <button className='font-light text-muted-foreground hover:text-foreground'>
                            <Bookmark className='size-5' strokeWidth={1.5} />
                        </button> */}
                        <div onClick={() => shareArticle()}
                        className="flex gap-1 items-center cursor-pointer px-3 py-2 border border-gray-200 rounded-2xl">
                            <span className="text-xs">Post on </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="w-4 h-4"><path fill="#000" d="M13.346 10.932 18.88 4.5h-1.311l-4.805 5.585L8.926 4.5H4.5l5.803 8.446L4.5 19.69h1.311l5.074-5.898 4.053 5.898h4.426zM11.55 13.02l-.588-.84-4.678-6.693h2.014l3.776 5.4.588.842 4.907 7.02h-2.014z"></path></svg>
                        </div>
                        {/* <button className='font-light text-muted-foreground hover:text-foreground'>
                            <Share className='size-5' strokeWidth={1.5} />
                        </button>
                        <button className='font-light text-muted-foreground hover:text-foreground'>
                            <Ellipsis className='size-5' strokeWidth={1.5} />
                        </button> */}
                    </div>
                </div>

                {/* Cover image */}
                {article?.coverImage && (
                <div className='mt-10'>
                    <img src={article?.coverImage} alt={article?.title} />
                </div>
                )}

                {/* Content */}
                <div className='mt-10'>
                    {/* <Editor post={article?.content} editable={false} /> */}
                    {
                        <BlockRenderer 
                        blocks={article.content?.blocks ?? []} 
                        article={article} 
                        accessRecord={accessRecord}
                        isFree={article.isFree} 
                        action={onAction} 
                        getArticle={getArticle}
                        />
                    }
                </div>
            </div>

            <div className="my-24 flex justify-center">
                <div className='w-max bg-gray-50 flex flex-col items-center shadow-md rounded-2xl p-7'>
                    <p className="mb-3 text-lg">How was the article?</p>
                    <StarRating onRatingChange={handleRatingChange} initialRating={userArticleRating?.rating ?? 0} />
                </div>
            </div> 

        </section>
    )
}

const StarRating = ({ initialRating = 0, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleRatingClick = (value) => {
        setRating(value);
        onRatingChange?.(value);
    };

    return (
        <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
            <button
            key={value}
            type="button"
            onClick={() => handleRatingClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            className="p-1 focus:outline-none"
            >
            <i
                className={`bx ${
                value <= (hover || rating || 0) ? 'bxs-star' : 'bx-star'
                } text-4xl ${
                value <= (hover ? hover : rating || 0) ? 'text-orange-500' : 'text-gray-300'
                } transition-colors`}
            ></i>
            </button>
        ))}
        </div>
    );
};