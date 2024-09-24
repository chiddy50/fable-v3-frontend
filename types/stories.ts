export interface Page {
    txt: string;
    png: string;
}

export interface Scene {
    txt: string;
    png: string|null;
    imageUrl?: string;
}

export interface Story {
    story: string;
    pages: Page[];
}


export interface StoryBookPage {
    content: string;
    image: string;
    number: number;
}

export interface StoryBook {
    storyTitle: string;
    genre: string;
    pages: StoryBookPage[];
}

export interface ThematicElementInterface {
    value:string, 
    label:string, 
    types: [
        {
            value:string, 
            label:string, 
        }
    ]
}

export interface ThematicOptionsInterface {
    value:string, 
    label:string, 
}