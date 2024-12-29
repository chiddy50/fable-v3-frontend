import ArticleComponent from '@/components/Article/ArticleComponent'
import React from 'react'

export default function ReaderArticlePage({ params }: { params: { slug: string } }) {
    const { slug } = params

    return (
        <div>
            <ArticleComponent slug={slug} />
        </div>
    )
}
