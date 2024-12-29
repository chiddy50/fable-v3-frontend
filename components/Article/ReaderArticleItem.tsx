import Link from 'next/link'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'

import { BookOpen, MessageSquare, Sparkle, ThumbsUp } from 'lucide-react'
import { formatDate } from '@/lib/helper'
import { ArticleInterface } from '@/interfaces/ArticleInterface'
import { Button } from '../ui/button'
import ArticleTagsComponent from './ArticleTagsComponent'
import AuthorAvatarComponent from '../Author/AuthorAvatarComponent'
import StarRatingComponent from '../Rating/StarRatingComponent'

export default function ReaderArticleItem({ article }: { article: ArticleInterface }) {
  console.log({
    articleRating: article
  });


  return (
    <li className='mb-4 p-7 sm:border-b bg-gray-700 text-gray-50 rounded-2xl'>
      {/* <Link href={`/articles/${article.id}`} className='block'> */}
        {/* Author */}

        <AuthorAvatarComponent user={article?.user} />

        <div className='flex flex-col-reverse gap-x-10 sm:flex-row sm:items-center'>
          {/* Post details */}
          <div className='mt-4 w-full sm:mt-0 sm:w-3/4'>
            <div className='space-y-1'>
              <h3 className='text-xl font-bold'>{article.title}</h3>
              <p className='text-sm text-muted-foreground'>{article.excerpt}</p>
            </div>

            <div className='mt-7 mb-3 flex items-center justify-between text-xs text-muted-foreground'>
              <div className='flex items-center gap-4'>
                {/* <Sparkle className='h-4 w-4 fill-yellow-500 text-yellow-500' /> */}
                {/* <span>{formatDate(article.createdAt)}</span> */}
                <span>{formatDate(article?.createdAt)}</span>
                <Separator orientation='vertical' className='h-4' />
                <div className='flex items-center gap-2'>
                  <ThumbsUp className='h-4 w-4' />
                  <span>{article.likeCount}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' />
                  <span>0</span>
                </div>
              </div>
            </div>

            <StarRatingComponent rating={article?.averageRating} />

            <Link href={`/articles/${article.id}`} >

              <Button variant="outline" size="sm" className='text-gray-800 mt-4'>
                Read
                <BookOpen />
              </Button>
            </Link>

            <div className="mt-4">
              <ArticleTagsComponent data={article?.articleTags ?? []} />
            </div>

          </div>

          {/* Cover Image */}
          <div className='relative aspect-video w-full sm:w-1/4'>
            {article.coverImage && (
              <Image
                alt=''
                src={article.coverImage}
                className='h-full w-full rounded-md object-cover'
                fill
              />
            )}
          </div>
          
        </div>
      {/* </Link> */}
    </li>
  )
}
