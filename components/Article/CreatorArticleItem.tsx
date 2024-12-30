import Link from 'next/link'
import Image from 'next/image'

import { Article } from '@/lib/types'
import { combineName } from '@/lib/utils'

import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Edit, Edit3, MessageSquare, Sparkle, ThumbsUp, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/helper'
import { Button } from '../ui/button'
import ArticleTagsComponent from './ArticleTagsComponent'
import { ArticleInterface } from '@/interfaces/ArticleInterface'

export default function CreatorArticleItem({ article }: { article: ArticleInterface }) {
  return (
    <li className='mb-4 p-7 sm:border-b bg-gray-50 text-gray-800 rounded-2xl'>
      <div className='flex flex-col-reverse gap-x-10 sm:flex-row sm:items-center'>
        {/* Post details */}
        <div className='mt-4 w-full sm:mt-0 sm:w-3/4'>
          <div className='space-y-1'>
            <h3 className='text-xl font-bold'>{article.title}</h3>
            <p className='text-sm text-muted-foreground'>{article.excerpt}</p>
          </div>

          <ArticleTagsComponent data={article?.articleTags ?? []} />

          <div className='mt-7 flex flex-col gap-5 justify-between text-xs text-muted-foreground'>
            <div className='flex items-center gap-4'>
              <Sparkle className='h-4 w-4 fill-yellow-500 text-yellow-500' />
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
            <div className="flex items-center gap-5">
              <Link href={`/dashboard/article/${article.id}`} className='block'>
                <Button size="icon" className="bg-custom_green">
                  <Edit3 className="w-5 h-5"/>     
                </Button>
              </Link>

              <Button size="icon" variant="destructive">
                <Trash2 className="w-5 h-5"/>     
              </Button>
            </div>
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
    </li>
  )
}
