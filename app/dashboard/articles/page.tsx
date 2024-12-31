"use client";

import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { useRouter } from 'next/navigation';
import { createSlugFromName } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod'
import { newArticleSchema } from '@/lib/schemas';
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { Skeleton } from '@/components/ui/skeleton';
import CreatorArticleItem from '@/components/Article/CreatorArticleItem';

type Inputs = z.infer<typeof newArticleSchema>

const ArticlesDashboardPage = () => {
    const [openNewArticleModal, setOpenNewArticleModal] = useState<boolean>(false);  
    const [openNewProjectModal, setOpenNewProjectModal] = useState<boolean>(false);
    const [creatorName, setCreatorName]= useState<string>('');    
    const [authUser, setAuthUser]= useState(null);   
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [articles, setArticles]= useState([]);   

    const router = useRouter();

    useEffect(() => {
        getArticles()
    }, []);

    const getArticles = async () => {
        try {
            setIsFetching(true);
            const response = await axiosInterceptorInstance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/articles/user`)
            setArticles(response?.data?.articles)
        } catch (error) {
            console.error(error);            
        }finally{
            setIsFetching(false)
        }
    }


    const {
        watch,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<Inputs>({
        resolver: zodResolver(newArticleSchema),
        defaultValues: {}
    });

    const title = watch('title');
    useEffect(() => {
        if (title) {
            const slug = createSlugFromName(title)
    
            if (slug) {
                setValue('slug', slug, { shouldValidate: true })
            }
        }
    }, [title]);

    const createNewArticle: SubmitHandler<Inputs> = async (data) => {
        console.log({creatorName});
        
        if (!creatorName) {
            toast.error("Kindly provide a username or alias");
            return;
        }
        
        try {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles`;
            showPageLoader();
            const response = await axiosInterceptorInstance.post(url, {...data, creatorName, type: "editorJs"});

            const article = response?.data?.article;
            if (!article?.id) {
                toast.error("Unable to create article");
                hidePageLoader();
                return;
            }
            router.push(`/dashboard/article/${article?.id}`);
            
        } catch (error) {
            console.error(error);      
        }finally{
            hidePageLoader();
        }
    }

    const triggerOpenNewArticleModal = async () => {
        try {
            showPageLoader()
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/users/auth`;

            const response = await axiosInterceptorInstance.get(url);
            
            const authUser = response?.data?.user;
            if (!authUser) {
                toast.error("Something went wrong");
                return;
            }

            setCreatorName(authUser?.name ?? "");
            setAuthUser(authUser);

            setOpenNewArticleModal(true)
        } catch (error) {
            console.error(error);            
        }finally{
            hidePageLoader()
        }        
    }



    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Articles</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="my-10">
                <div className="flex items-center justify-between mb-5">                
                    <Button onClick={triggerOpenNewArticleModal}
                    size="sm" className='bg-custom_green hover:bg-custom_green'>
                        <Plus className='w-4 h-4'/> New Article
                    </Button>                    
                </div>
            </div>

            {
                isFetching &&
                <div className="my-10">
                    <Skeleton className="w-full h-[190px] rounded-xl" />
                </div>
            }



            {
                !isFetching &&
                <div>
                    {
                        articles?.length < 1 &&
                        <div className='flex flex-col items-center'>
                            <img src="/no-results.svg" alt="no-data-image" className="w-[200px] h-[200px]" />
                            <p className="font-semibold">No Articles</p>
                        </div>
                    }

                    <ul>
                        {articles.map(article => (
                            <CreatorArticleItem key={article.id} article={article} showAvatar={false} />
                        ))}
                    </ul>
                </div>
            }

            <Dialog open={openNewArticleModal} onOpenChange={setOpenNewArticleModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Create Article</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                        <form onSubmit={handleSubmit(createNewArticle)}>                        
                            <div className="mb-3">
                                <p className="mb-1 text-xs font-semibold">Title <span className='text-red-500 text-md font-bold'>*</span></p>
                                <Input                
                                className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                placeholder='Article title'
                                {...register('title')}
                                />

                                {errors.title?.message && (
                                    <p className='mt-1 px-2 text-xs text-red-400'>
                                    {errors.title.message}
                                    </p>
                                )}
                            </div>     

                            <div className="mb-3">
                                <p className="mb-1 text-xs font-semibold">Slug <span className='text-red-500 text-md font-bold'>*</span></p>
                                <Input 
                                type='text'
                                className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                placeholder='Article slug'
                                {...register('slug')}
                                />
                                {errors.slug?.message && (
                                    <p className='mt-1 px-2 text-xs text-red-400'>
                                    {errors.slug.message}
                                    </p>
                                )}
                            </div>      

                            {authUser && !authUser?.name &&                        
                                <div className="mb-4">
                                    <p className="mb-1 text-xs font-semibold">Username or Alias<span className='text-red-500 text-md font-bold'>*</span></p>
                                    <Input 
                                    defaultValue={authUser?.name}
                                    onKeyUp={(e) => setCreatorName(e.target.value)} 
                                    onPaste={(e) => setCreatorName(e.target.value)} 
                                    className='w-full text-xs p-5 outline-none border rounded-xl mb-3 resize-none'
                                    placeholder='Username or Alias'
                                    />
                                </div>
                            }                  

                            <Button type='submit' disabled={isSubmitting} className='text-gray-50 mr-5 w-full bg-[#46aa41]'>Proceed</Button>
                        </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ArticlesDashboardPage
