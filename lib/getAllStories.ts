import fs from 'fs';
import { Page, Story, StoryBook, StoryBookPage } from "@/types/stories";
import path from "path";
import cleanTitle from './cleanTitle';
import { extractTextBeforeDot } from './getStoryScenes';

const storiesDirectory = path.join(process.cwd(), "public/stories");

// Access the public files and retrieve all the stories
export function getAllStories(): Story[] {
    if (!fs.existsSync(storiesDirectory)) {
        return [];
    }

    const storyFolders = fs.readdirSync(storiesDirectory);

    const stories: Story[] = storyFolders.map(storyFolder => {
        const storyPath = path.join(storiesDirectory, storyFolder);
        const files = fs.readdirSync(storyPath);

        const pages: Page[] = [];
        const pageMap: { [key: string]: Partial<Page> } = {};

        files.forEach(file => {
            const filePath = path.join(storyPath, file);
            const type = path.extname(file).substring(1);
            const pageNumber = file.match(/page(\d+)\./)?.[1]

            if (pageNumber) {                
                if (!pageMap[pageNumber]) {
                    pageMap[pageNumber] = {};
                }

                if (type === 'txt') {
                    pageMap[pageNumber].txt = fs.readFileSync(filePath, "utf-8");
                }else if(type === 'png'){
                    pageMap[pageNumber].png = `/stories/${storyFolder}/${file}`;
                }
            }
        });

        Object.keys(pageMap).forEach((pageNumber) => {
            if (pageMap[pageNumber].txt && pageMap[pageNumber].png) {
                pages.push(pageMap[pageNumber] as Page);
            }
        });

        return {
            story: cleanTitle(storyFolder),
            pages   
        }
    });

    const storiesWithPages = stories.filter((story) => story.pages.length);

    return storiesWithPages;
}

export const getStory = (story: string): Story | undefined => {
    const stories = getAllStories();
    return stories.find((s) => s.story === story);
}

export function getStoryBooks(email = '') {

    const storyBooksDirectory = path.join(process.cwd(), `public/books/${email}`);

    if (!fs.existsSync(storyBooksDirectory)) {
        return [];
    }

    const storyFolders = fs.readdirSync(storyBooksDirectory);

    const stories: StoryBook[] = storyFolders.map(storyFolder => {
        const storyPath = path.join(storyBooksDirectory, storyFolder);
        const files = fs.readdirSync(storyPath);

        const pages: StoryBookPage[] = [];
        const pageMap: { [key: string]: Partial<StoryBookPage> } = {};
        let genre: string = '';

        files.forEach(file => {
            const filePath = path.join(storyPath, file);
            const type = path.extname(file).substring(1);
            const pageNumber = file.match(/page(\d+)\./)?.[1]
            const isGenre = extractTextBeforeDot(file) === 'genre';

            if (isGenre && type === 'txt') {
                genre = fs.readFileSync(filePath, "utf-8");                    
            }

            if (pageNumber) {                
                if (!pageMap[pageNumber]) {
                    pageMap[pageNumber] = {};
                }else{
                    pageMap[pageNumber].number = parseInt(pageNumber);
                }

                if (type === 'txt') {
                    pageMap[pageNumber].content = fs.readFileSync(filePath, "utf-8");
                }else if(type === 'png'){
                    pageMap[pageNumber].image = `/books/${email}/${storyFolder}/${file}`;
                }
            }
        });

        Object.keys(pageMap).forEach((pageNumber) => {
            if (pageMap[pageNumber].content && pageMap[pageNumber].image) {
                pages.push(pageMap[pageNumber] as StoryBookPage);
            }
        });

        return {
            storyTitle: cleanTitle(storyFolder),
            pages,
            genre   
        }
    });

    const storiesWithPages = stories.filter((story) => story.pages.length);

    return storiesWithPages;
}
