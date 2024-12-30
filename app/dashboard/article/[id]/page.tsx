"use client";

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WriteArticleComponent from '@/components/Dashboard/Articles/WriteArticleComponent';


interface Props {
    params: {
      id: string;
    };
  }
  

const CreateArticlePage = ({params: {id}}: Props) => {

    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbPage>Article</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <section className='pb-24 pt-10 sm:pt-10'>
                <div className='container max-w-full bg-white p-5 rounded-2xl '>
                {/* max-w-3xl */}
                    <h1 className='mb-10 text-center text-5xl font-medium'>
                    New Article
                    </h1>

                    <WriteArticleComponent articleId={id}/>
                </div>
            </section>
        </div>
    )
}

export default CreateArticlePage
