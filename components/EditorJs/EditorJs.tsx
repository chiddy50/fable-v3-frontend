"use client";

import { useEffect, useRef} from 'react';
import EditorJS from '@editorjs/editorjs';
import { EDITOR_TOOLS } from "@/lib/tools";
import classes from '@/app/editorjs.module.css';

const EditorJs = ({ data, onChange }) => {
    const ref = useRef();
    useEffect(() => {
        if (!ref.current) {
            try {                
                const editor = new EditorJS({
                    holder: "editorjs",
                    data: data,
                    tools: EDITOR_TOOLS,
                    async onChange(api, event) {
                        const data = await api.saver.save();
                        console.log({data, api, event});
                        onChange(data)                    
                    }
                });
                
                ref.current = editor
            } catch (error) {
                console.error('Editor.js initialization error:', error);
            }
        }

        return () => {
            if(ref.current && ref.current?.destroy) {
                ref.current.destroy()
            }
        }
    }, [])
    
    return (
        <div id="editorjs" className={classes.editorjs} />
    )
}

export default EditorJs
