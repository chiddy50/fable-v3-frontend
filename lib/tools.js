// @ts-ignore
"use client";

import Header from "@editorjs/header";
import Code from "@editorjs/code"; 
import InlineCode from "@editorjs/inline-code"; 
import List from "@editorjs/list"; 
import Quote from "@editorjs/quote"; 
import Hyperlink from "editorjs-hyperlink"; 
import Paragraph from "@editorjs/paragraph"; 
import Image from '@editorjs/image'; 
import LinkTool from '@editorjs/link';
import Table from '@editorjs/table';
import RawTool from '@editorjs/raw';
import SimpleImage from "@editorjs/simple-image";

import GetCodePaywallTool from "./GetCodePaywallTool";
import CustomEmbed from "@/components/EditorJs/CustomEmbed";
import axios from "axios";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";

export const EDITOR_TOOLS = {
    header: { 
        class: Header,      
        inlineToolbar: ['link'],
        config: {        
            placeholder: 'Enter a Heading',         
            levels: [1, 2, 3, 6],     
            defaultLevel: 1        
        }
    },
    paywall: GetCodePaywallTool, 
    paragraph: { 
        class: Paragraph,        
        inlineToolbar: true        
    },  
    image: { 
        class: Image,        
        config: {        
            uploader: {        
                uploadByFile: async (file) => { //this function will be triggered when image gets selected                 
                    console.log(file);
                    const imageUrl = await uploadImage(file);
                    console.log({imageUrl});
                    
                    return {        
                        success: 1,        
                        file: {        
                            // url: URL.createObjectURL(file),  
                            url: imageUrl,      
                            raw: file        
                        }        
                    } 
                },
                // uploadByUrl(url){
                //     // your ajax request for uploading
                //     return MyAjax.upload(file).then(() => {
                //       return {
                //         success: 1,
                //         file: {
                //           url: 'https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg',,
                //           // any other image data you want to store, such as width, height, color, extension, etc
                //         }
                //       }
                //     })
                // } 
            },
            endpoints: {
                byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
            },
            actions: [
                {
                    name: 'new_button',
                    icon: '<svg>...</svg>',
                    title: 'New Button',
                    toggle: true,
                    action: (name) => {
                        alert(`${name} button clicked`);
                    }
                }
            ]
        } 
    },   
    youtube: CustomEmbed,
    list: { 
        class: List,        
        inlineToolbar: true 
    }, 
    quote: Quote,
    code: Code,
    table: {
        class: Table,
        inlineToolbar: true,
        config: {
            rows: 2,
            cols: 3,
            maxRows: 5,
            maxCols: 5,
        },
    },    
    raw: RawTool,
    hyperlink: {
        class: Hyperlink,
        config: {
            shortcut: 'CMD+L',
            target: '_blank',
            rel: 'nofollow',
            availableTargets: ['_blank', '_self'],
            availableRels: ['author', 'noreferrer'],
            validate: false,
        }
    },
}


const uploadImage = async (file) => {
    try {
      const preset_key = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY ?? "";
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (file && preset_key && cloudName) {
        const formData = new FormData();
        formData.append("file", file)
        formData.append("upload_preset", preset_key)

        // setSaving(true)
        let res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          formData,
          {
            // onUploadProgress,
          }
        )
        console.log("Image: ", res);
        // setImageId(res?.data?.secure_url)
        // setImageSignature(res?.data?.signature)
        // setImagePublicId(res?.data?.public_id)

        // let imageSaved = await saveCoverImage({
        //   signature: res?.data?.signature,
        //   publicId: res?.data?.public_id,
        //   imageUrl: res?.data?.secure_url,
        //   metaData: res?.data
        // });
        
        return res?.data?.secure_url
      };
    } catch (error) {
      console.log(error)
    } finally {
    //   setSaving(false)
    }
}

const saveCoverImage = async (payload) => {

    let body = { ...payload, 
        ownerId: articleId,  
        ownerType: "Article",
        description: "cover-image",
        source: "uploaded"
    }
    console.log({payload, body});
        
    try {
        const updated = await axiosInterceptorInstance.post(`/images`, body);
    } catch (error) {
        console.error(error);			
    }
}