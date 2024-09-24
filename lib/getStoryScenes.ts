import fs from 'fs';
import { Page, Scene, Story } from "@/types/stories";
import path from "path";
import cleanTitle from './cleanTitle';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';



// Access the public files and retrieve all the stories
export function getStoriesData(email = '') {
    const storiesDirectory = path.join(process.cwd(), `public/scenes/${email}`);
    if (!fs.existsSync(storiesDirectory)) {
        return [];
    }
    
    try {   
        const storyFolders = fs.readdirSync(storiesDirectory);

        let test = []

        const stories = storyFolders.map(storyFolder => {
            if (storyFolder === '.DS_Store') {
                fs.unlink(path.join(storiesDirectory, storyFolder), err => {
                    if (err) console.error(err);
                });
                return null;
            }
                  


            const storyPath = path.join(storiesDirectory, storyFolder);
            const files = fs.readdirSync(storyPath);

            const scenes: Scene[] = [];
            const sceneMap: { [key: string]: Partial<Scene> } = {};

            const characters: Scene[] = [];
            const characterMap: { [key: string]: Partial<Scene> } = {};

            const overview = { txt: '', png: '' };
            const genre = { name: '' };            

            files.forEach(file => {
                const filePath = path.join(storyPath, file);
                test.push({filePath, file})
                console.log({filePath, file});
                // const innerFilePath = path.join(filePath, file);

                // const innerFiles = fs.readdirSync(filePath);                
                // innerFiles.forEach(innerFile => {
                    
                // });

                const type = path.extname(file).substring(1);
                const sceneNumber = file.match(/scene(\d+)\./)?.[1];
                const characterNumber = file.match(/character(\d+)\./)?.[1];
                const isOverview = extractTextBeforeDot(file) === 'overview';
                const isGenre = extractTextBeforeDot(file) === 'genre';
                
                if (isOverview) {

                    if (type === 'txt') {
                        overview.txt = fs.readFileSync(filePath, "utf-8");
                    } else if (type === 'png') {
                        overview.png = `/scenes/${email}/${storyFolder}/${file}`;
                    }
                }

                if (isGenre && type === 'txt') {
                    genre.name = fs.readFileSync(filePath, "utf-8");                    
                }

                if (characterNumber) {                        
                
                    if (!characterMap[characterNumber]) {
                        characterMap[characterNumber] = { png: null };
                    }
                    if (type === 'json') {
                        const characterTextFile = fs.readFileSync(filePath, "utf-8");
                        characterMap[characterNumber].txt = JSON.parse(characterTextFile);
                    } else if (type === 'png') {
                        characterMap[characterNumber].png = `/scenes/${email}/${storyFolder}/${file}`;
                    }
                }

                if (sceneNumber) {
                    if (!sceneMap[sceneNumber]) {
                        sceneMap[sceneNumber] = {};
                    }
                    if (type === 'txt') {
                        sceneMap[sceneNumber].txt = fs.readFileSync(filePath, "utf-8");
                    } else if (type === 'png') {
                        sceneMap[sceneNumber].png = `/scenes/${email}/${storyFolder}/${file}`;
                    }
                }


            });

            Object.keys(sceneMap).forEach(sceneNumber => {
                if (sceneMap[sceneNumber].txt) {
                    if (!Object.hasOwn(sceneMap[sceneNumber], 'png')) {
                        sceneMap[sceneNumber].png = '';
                    }
                    scenes.push(sceneMap[sceneNumber] as Page);
                }
            });

            Object.keys(characterMap).forEach(characterNumber => {
                characters.push(characterMap[characterNumber] as Page);
            });

            return {
                story: cleanTitle(storyFolder),
                scenes,
                overview,
                genre,
                characters
            };
        })
        .filter(Boolean);

        // return test;

        const allStories = stories.filter((story) => story.scenes.length);

        return allStories;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getStoryData = (story: string) => {
    const stories = getStoriesData();
    return stories.find((s) => s.story === story);
}


export function extractTextBeforeDot(filename: string) {
    // Find the position of the first dot in the string
    const dotIndex = filename.indexOf('.');
    
    // If a dot is found, return the substring before the dot
    if (dotIndex !== -1) {
        return filename.substring(0, dotIndex);
    }
    
    // If no dot is found, return the original string
    return filename;
}

