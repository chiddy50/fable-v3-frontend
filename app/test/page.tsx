"use client";

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from '@langchain/groq';
import { cn } from '@/lib/utils';
// import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
    EditorBubble,
    EditorBubbleItem,
    EditorCommand,
    EditorCommandItem,
    EditorContent,
    EditorRoot,
} from "novel";

const TestPage = () => {
    const [content, setContent] = useState(null);
    const [post, setPost] = useState<string>(``);
    const query = async () => {
        const response = await fetch('/api/test')
        const reader = response.body.getReader()

        setPost("")
        while (true) {
            const { done, value } = await reader.read()
            if (done) break
            const text = new TextDecoder().decode(value)
            console.log(text) // Or append to your UI
            setPost(prev => prev += text);
        }
        // const res = await axios.get("/api/test");
        // console.log(res);
    }


    return (
        <div>
            <div className='mt-[120px]'>

                <Button onClick={query}>Test Login</Button>

            
                <div className="m-7 whitespace-pre-wrap p-5 border rounded-2xl outline-none" contentEditable>
                    {/* <ReactMarkdown>{post}</ReactMarkdown> */}
                    
                    {/* <ReactMarkdown
                        components={{
                            code({ className, children, ...rest }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return match ? (
                                <SyntaxHighlighter
                                    PreTag="div"
                                    language={match[1]}
                                    style={dark}
                                    {...rest}
                                >
                                    {children}
                                </SyntaxHighlighter>
                                ) : (
                                <code {...rest} className={className}>
                                    {children}
                                </code>
                                );
                            },
                        }}
                    >
                        {post}
                    </ReactMarkdown> */}

                    {/* <textarea 
                        rows={30} 
                    
                        onChange={(e) => {
                            setPost(e.target.value);
                        }}
                        value={post} 
                        placeholder=''
                        className={cn('p-5 mb-4 outline-none border text-sm whitespace-pre-wrap rounded-lg w-full leading-5',)} 
                    /> */}
                </div>


            </div>  
        </div>
    )
}

export default TestPage
