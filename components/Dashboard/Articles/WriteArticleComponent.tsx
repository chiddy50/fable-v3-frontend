'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { JSONContent } from 'novel'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'

import { updateArticleSchema } from '@/lib/schemas'
import { createSlugFromName } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Editor from '@/components/editor/editor'
import { Spinner } from '@/components/ui/spinner'
import ImageUploader from '@/components/image-uploader'
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query';
import axiosInterceptorInstance from '@/axiosInterceptorInstance'
import { ArticleInterface } from '@/interfaces/ArticleInterface'
import { hidePageLoader, showPageLoader } from '@/lib/helper'
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import CreateArticlePaymentComponent from './CreateArticlePaymentComponent'
import EditorJs from '@/components/EditorJs/EditorJs'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'


type Inputs = z.infer<typeof updateArticleSchema>


const INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [
        {
            type: "header",
            data: {
                text: "This is a tutorial of Editor js",
                level: 1
            }
        }
    ]
};

const WriteArticleComponent = ({ articleId }: { articleId: string }) => {
    // console.log({articleId});
    
    const router = useRouter();
  
    const [filePickerIsOpen, setFilePickerIsOpen] = useState(false);
    const [imagePublicId, setImagePublicId] = useState("");
    const [imageSignature, setImageSignature] = useState("");
    const [article, setArticle] = useState<ArticleInterface|null>(null)
    // const [data, setData] = useState(null);
    const [data, setData] = useState(INITIAL_DATA);    
    const [isFree, setIsFree] = useState<boolean>(true);
    const [price, setPrice] = useState<number>(0);
    const [openAddAddressModal, setOpenAddAddressModal] = useState<boolean>(false);
    const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
    const [depositAddress, setDepositAddress]= useState<string>('');    
    const [tipLink, setTipLink]= useState<string>('');    
    const [body, setBody]= useState<object|null>(null);      
    const [tags, setTags]= useState<Option[] | []>([]);  
    const [tagList, setTagList] = useState([]);    

    const {
        watch,
        register,
        setValue,
        getValues,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<Inputs>({
        resolver: zodResolver(updateArticleSchema),
        defaultValues: {}
    });

      
    const { data: articleData, isFetching, isError, refetch } = useQuery({
        queryKey: ['fetchArticle', articleId],
        queryFn: async () => {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${articleId}`;

            const response = await axiosInterceptorInstance.get(url);
            if (response?.data?.article) {
                setArticle(response?.data?.article);
                
                configureArticleTags(response?.data?.tags);
                setExistingTags(response?.data?.article?.articleTags ?? [])

                // SET ARTICLE VALUES
                setValue('coverImageId', response?.data?.article?.coverImage);
                setValue('title', response?.data?.article?.title);
                setValue('excerpt', response?.data?.article?.excerpt);
                setValue('slug', response?.data?.article?.slug, { shouldValidate: true });
                const content = response?.data?.article?.content;
                // setValue('content', content);
                setData(content);
                const defaultPrice = response?.data?.article?.price ? response?.data?.article?.price : 0;
                setPrice(defaultPrice);
                setIsFree(response?.data?.article?.isFree)
            }
            setDepositAddress(response?.data?.user?.depositAddress ?? "");
            setTipLink(response?.data?.user?.tipLink ?? "");
            return response?.data?.article;
        },
        enabled: !!articleId && !article 
    });

    const el = useRef<HTMLDivElement>(null);
    // CODE ARTICLE PAYMENT
    
    function setCoverImageId(url: string) {
      setValue('coverImageId', url)
      setFilePickerIsOpen(false)
    }
  
    // function setContent(content: JSONContent) {
    //   setValue('content', content, { shouldValidate: true })
    // }
  
    const title = watch('title')
    useEffect(() => {
        if (title) {
            const slug = createSlugFromName(title)
    
            if (slug) {
            setValue('slug', slug, { shouldValidate: true })
            }
        }
    }, [title])
  
    const processForm: SubmitHandler<Inputs> = async payload => {
        const fullPayload = {...payload, imagePublicId, imageSignature, tags, content: data, isFree, price }
        console.log({
            fullPayload        
        });
        // return;
        setBody(fullPayload);

        if (tags.length < 1) {
            toast.error('Kindly select at least one category')
            return;
        }

        if (!data || data?.blocks?.length < 1) {
            toast.error('Please add some content to the article')
            return;
        }

        // setOpenAddAddressModal(true);  
        if (!isFree && !data?.blocks.find(block => block.type === "paywall")) {
            toast.error('Provide a paywall for this paid article');
            return;
        }
          
        if (!isFree && price < 0.1) {
            toast.error('Invalid article price');
            return;
        }
        
        await updateArticle(fullPayload);

        if (!isFree && !articleData?.paidAt) {
            setOpenPaymentModal(true);
            return;
        }
          
        setOpenAddAddressModal(true);  

    }

    const updateArticle = async (fullPayload) => {
        try {
            // let publishedAt = publish === true ? new Date() : null;

            // const payload = { ...body, 
            const payload = { ...fullPayload, 
                // publishedAt, 
                depositAddress, tipLink 
            };
            console.log({payload});
            // return;

            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${articleId}`;
            console.log(payload);
            
            showPageLoader();
            const response = await axiosInterceptorInstance.put(url, payload);
            console.log(response);
            
            // const postSlug = ""
            // const postSlug = await createPost({
            //   ...data,
            //   coverImageId: data.coverImageId as Id<'_storage'> | undefined,
            //   content: JSON.stringify(contentJson)
            // })
    
            // if (!postSlug) throw new Error('Failed to create post')
    
            // router.push(`/posts/${postSlug}`)
            toast.success('Article updated!');
            setOpenAddAddressModal(false);

        } catch (error) {
            console.log(error);            
            toast.error('Failed to update article');
        }finally{
            hidePageLoader();
        }
    }

    const publishOrUnpublishArticle = async (publish: string) => {
        try {            
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${articleId}`;
            let publishedAt = publish === "publish" ? new Date() : null;
            
            showPageLoader();
            const response = await axiosInterceptorInstance.put(url, {
                depositAddress, 
                tipLink,
                publishedAt,
                publishStatus: publish,
            });
            setOpenAddAddressModal(false);


        } catch (error) {
            toast.error('Failed to update article')
        }finally{
            hidePageLoader();
        }
    }

    const configureArticleTags = (tags: { id: string, title: string, description:  string }[]) => {
        if (tags) {
            const articleTags = tags.map(tag => {
                return {
                    id: tag.id,
                    label: tag.title,
                    value: tag.title,
                    description: tag.description,
                }
            });
            setTagList(articleTags);
        }
    }

    const setExistingTags = (articleTags: { 
        articleTag: { id: string, title: string, description: string } 
    }[]) => {
        let data = articleTags?.map((item) => {
            return {
                id: item.articleTag.id,
                label: item.articleTag.title,
                value: item.articleTag.title,
                description: item.articleTag.description,
            }
        });
        setTags(data);
    }

    const saveUnpaidArticle = () => {
        setOpenPaymentModal(true);
    }

    const openPublishModal = () => {
        setOpenPaymentModal(false)
        setOpenAddAddressModal(true);
    }
     
    return (
        <form onSubmit={handleSubmit(processForm)}>
            {
                isFetching &&
                <div className="flex justify-center h-96">
                    <Spinner className='h-24 w-24' />
                </div>
            }
            {
                !isFetching &&
                <div className='flex flex-col gap-4'>
                    {/* Cover image */}
                    <div className='flex justify-between gap-4'>
                        <div className='w-full'>
                            <Input
                                disabled
                                type='text'
                                className='w-full'
                                placeholder='Select a cover image'
                                {...register('coverImageId')}
                            />
                            {errors.coverImageId?.message && (
                                <p className='mt-1 px-2 text-xs text-red-400'>
                                {errors.coverImageId.message}
                                </p>
                            )}
                        </div>
                        <Dialog open={filePickerIsOpen} onOpenChange={setFilePickerIsOpen}>
                            <DialogTrigger asChild>
                                <Button size='sm'>Select file</Button>
                            </DialogTrigger>
                            <DialogTitle></DialogTitle>
                            <DialogContent>
                                <ImageUploader 
                                articleId={articleId}
                                setImageId={setCoverImageId} 
                                setImageSignature={setImageSignature} 
                                setImagePublicId={setImagePublicId} 
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
        
                    {/* Title and slug */}
                    <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                        <div className='flex-1 p-5 mb-4 border rounded-2xl bg-gray-50'>
                            <label className='block mb-1 text-sm font-semibold '>Title</label>
                            <Input
                                type='text'
                                placeholder='Article title'
                                {...register('title')}
                            />
                            {errors.title?.message && (
                                <p className='mt-1 px-2 text-xs text-red-400'>
                                {errors.title.message}
                                </p>
                            )}
                        </div>
                        {/* <div className='flex-1'>
                        <Input type='text' placeholder='Article slug' {...register('slug')} />
                        {errors.slug?.message && (
                            <p className='mt-1 px-2 text-xs text-red-400'>
                            {errors.slug.message}
                            </p>
                        )}
                        </div> */}
                    </div>
            
                    {/* Excerpt */}
                    <div className='p-5 mb-4 border rounded-2xl bg-gray-50'> 
                        <label className='block mb-1 font-semibold text-sm'>Description</label>
                        <Input
                        type='text'
                        placeholder='Description or Excerpt'
                        {...register('excerpt')}
                        />
                        {errors.excerpt?.message && (
                        <p className='mt-1 px-2 text-xs text-red-400'>
                            {errors.excerpt.message}
                        </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className='p-5 mb-5 border rounded-2xl bg-gray-50'> 
                        <p className="font-semibold mb-2 text-sm">Category</p>       
                        <MultipleSelector
                            creatable
                            maxSelected={4}
                            // disabled={initialStory?.introductionLocked}
                            value={tags}
                            onChange={setTags}
                            defaultOptions={tagList}
                            placeholder="Choose genres"
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                </p>
                            }
                            className='outline-none bg-white'
                        />  
                    </div>
            
                    {/* Content */}
                    <div className='border rounded-xl py-5'>
                        {
                            // !isFetching &&
                            // <Editor editable={true} setContent={setContent} 
                            // post={getValues("content")}
                            // />
                        }        

                        {
                            <EditorJs data={data} onChange={setData} />
                        }            
                    </div>


                    <div className="flex items-center space-x-2 mb-3">
                        <Switch
                            id="article-free"
                            checked={isFree}
                            onCheckedChange={(value) => setIsFree(value)}
                            // {...register('isFree')}
                        />
                        <Label htmlFor="article-free">Free Article</Label>
                    </div>

                    {
                    !isFree && 
                    <div className="mb-3">
                        <Label htmlFor="article-free">Price - ${price}</Label>     
                  
                        <div className="mt-2">                            
                            {/* <Slider 
                                onValueChange={(values) => setPrice(values)}
                                defaultValue={[0]} minStepsBetweenThumbs={5} min={0} max={2} step={0.01} 
                            /> */}
                            <input
                                type="range"
                                className="w-full"
                                min={0}
                                max={1}
                                step={0.1}
                                value={price}
                                onChange={e => setPrice(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                    }

                        
                    {/* {   !isFree && !articleData?.paidAt && 
                        <Button
                        onClick={saveUnpaidArticle}
                        className='w-full sm:w-1/2'
                        >
                            Proceed
                        </Button>
                        // <div className="flex justify-center">
                        //     <CreateArticlePaymentComponent article={articleData} refetch={refetch} />
                        // </div>
                    } */}

                    {   
                    // articleData?.paidAt && !isFree &&
                        <div>
                            <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full sm:w-1/2'
                            >
                            {isSubmitting ? (
                                <>
                                <Spinner className='mr-2' />
                                <span>Saving article...</span>
                                </>
                            ) : (
                                'Save'
                            )}
                            </Button>
                        </div>
                    }

                    {/* {   isFree &&
                        <div>
                            <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='w-full sm:w-1/2'
                            >
                            {isSubmitting ? (
                                <>
                                <Spinner className='mr-2' />
                                <span>Saving article...</span>
                                </>
                            ) : (
                                'Save'
                            )}
                            </Button>
                        </div>
                    } */}
                </div>
            }


            <Dialog open={openAddAddressModal} onOpenChange={setOpenAddAddressModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Save Progress</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div>
                        {
                            isFree === false &&
                            <div>
                                <div className="mb-4">
                                    <p className="mb-1 text-xs font-semibold">Code Wallet Address <span className='text-red-500 text-md font-bold'>*</span></p>
                                    <div className="flex border items-center rounded-2xl p-1.5">
                                        <div className='flex items-center'>
                                            <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                                        </div>
                                        <input type="text" 
                                        value={depositAddress}
                                        className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                                        placeholder='5wBP4XzTEVoVxkEm4e5NJ2Dgg45DHkH2kSweGEJaJ91w'
                                        onChange={(e) => setDepositAddress(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="mb-1 text-xs font-semibold">Tip card link</p>

                                    <div className="flex border items-center rounded-2xl p-1.5">
                                        <div className='flex items-center'>
                                            <img src="/images/codeImage.png" className='w-6 h-6' alt="code wallet icon" />
                                        </div>
                                        <input type="text" 
                                        className='w-full h-full text-xs pr-4 pl-2 py-2 outline-none border-none'
                                        placeholder='https://tipcard.getcode.com/X/x-handle'
                                        value={tipLink}
                                        onChange={(e) => setTipLink(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-3 bg-red-100 border border-red-300 p-3 rounded-2xl">
                                    <p className='text-[10px] text-red-500'>
                                    Caution: Please ensure you provide a valid Code Wallet deposit address. Not all Solana addresses are compatible with Code Wallet transactions. If the address is incorrect, you may not receive tips or payments for your content. Double-check your Code Wallet deposit address to avoid missing out on rewards.
                                    </p>
                                </div>
                            </div>
                        }

                        <div className="flex items-center justify-between gap-5">
                            <Button onClick={() => publishOrUnpublishArticle("draft")} className='text-gray-50 w-full'>Draft</Button>
                            <Button onClick={() => publishOrUnpublishArticle('publish')} className='text-gray-50 w-full bg-[#46aa41]'>Publish</Button>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className=''>Make Payment</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                        <div className="flex justify-center">
                            <CreateArticlePaymentComponent article={articleData} refetch={refetch} openPublishModal={openPublishModal} />
                        </div>
                    </DialogContent>
            </Dialog>

            
        </form>
    )
}

export default WriteArticleComponent
