export const contentTypes = [
    {
        type: "Fiction",
        description: "Stories created from the imagination, not presented as fact. Often includes elements like characters, plot, and setting.",
        bestNarrativeStyles: [
            "First Person",
            "Third Person Limited",
            "Third Person Omniscient",
            "Multiple First Person",
            "Unreliable Narrator",
            "Stream of Consciousness",
            "Frame Narrative"
        ],
        recommendedTones: [
            "Optimistic",
            "Pessimistic",
            "Serious",
            "Humorous",
            "Lighthearted",
            "Dark",
            "Mysterious",
            "Suspenseful",
            "Melancholic",
            "Romantic",
            "Dramatic",
            "Adventurous",
            "Tense",
            "Playful",
            "Whimsical",
            "Gritty",
            "Exciting",
            "Reflective"
        ],
        recommendedGenres: [
            "Action",
            "Adventure",
            "Alternate History",
            "Apocalyptic",
            "Bildungsroman",
            "Coming-of-Age",
            "Comedy",
            "Crime",
            "Cyberpunk",
            "Drama",
            "Dystopian",
            "Fantasy",
            "Gothic",
            "Historical",
            "Humor",
            "Mystery",
            "Romance",
            "Science Fiction",
            "Short Story",
            "Suspense",
            "Thriller",
            "Time Travel",
            "Tragedy",
            "Urban Fantasy",
            "Western",
            "Young Adult"
        ],
        examples: ["Harry Potter", "Game of Thrones", "The Hunger Games"]
    },
    {
        type: "Non-Fiction",
        description: "Writing based on facts, real events, and real people, such as biography or history.",
        bestNarrativeStyles: [
            "First Person",
            "Third Person Objective",
            "Third Person Limited",
            "Epistolary",
            "Frame Narrative"
        ],
        recommendedTones: [
            "Serious",
            "Formal",
            "Informal",
            "Inspirational",
            "Motivational",
            "Confident",
            "Empathetic",
            "Critical",
            "Sincere",
            "Nostalgic",
            "Philosophical",
            "Reflective",
            "Objective",
            "Authoritative",
            "Neutral"
        ],
        recommendedGenres: [
            "Biographical",
            "Historical",
            "Non-Fiction",
            "Philosophical",
            "Self-Help",
            "Social Commentary"
        ],
        examples: ["Becoming by Michelle Obama", "Sapiens by Yuval Noah Harari"]
    },
    {
        type: "Game Lore",
        description: "Backstories, worldbuilding, and character histories that form the narrative universe of a game.",
        bestNarrativeStyles: [
            "Third Person Omniscient",
            "Epistolary",
            "Frame Narrative",
            "Multiple First Person"
        ],
        recommendedTones: [
            "Mysterious",
            "Dark",
            "Epic",
            "Heroic",
            "Dramatic",
            "Adventurous",
            "Fantastical",
            "Mythic"
        ],
        recommendedGenres: [
            "Fantasy",
            "Science Fiction",
            "Mythology",
            "Alternate History",
            "Superhero",
            "Steampunk",
            "Cyberpunk",
            "Apocalyptic",
            "Urban Fantasy"
        ],
        examples: ["Elden Ring", "The Witcher", "World of Warcraft"]
    },
    {
        type: "Educational",
        description: "Content created with the purpose of instructing or educating the audience on a specific topic.",
        bestNarrativeStyles: [
            "Second Person",
            "Third Person Objective",
            "Third Person Omniscient"
        ],
        recommendedTones: [
            "Formal",
            "Informal",
            "Inspirational",
            "Motivational",
            "Confident",
            "Authoritative",
            "Objective",
            "Neutral",
            "Persuasive"
        ],
        recommendedGenres: [
            "Non-Fiction",
            "Self-Help",
            "Social Commentary",
            "Philosophical"
        ],
        examples: ["Khan Academy Lessons", "Crash Course YouTube series"]
    },
    {
        type: "Blog",
        description: "Casual, often personal form of online writing that shares thoughts, opinions, or insights.",
        bestNarrativeStyles: [
            "First Person",
            "Second Person",
            "Multiple First Person",
            "Epistolary"
        ],
        recommendedTones: [
            "Optimistic",
            "Serious",
            "Humorous",
            "Informal",
            "Lighthearted",
            "Inspirational",
            "Motivational",
            "Confident",
            "Empathetic",
            "Sarcastic",
            "Critical",
            "Sincere",
            "Nostalgic",
            "Philosophical",
            "Reflective",
            "Persuasive",
            "Sentimental"
        ],
        recommendedGenres: [
            "Non-Fiction",
            "Humor",
            "Self-Help",
            "Social Commentary",
            "Satire"
        ],
        examples: ["Medium Articles", "Personal Developer Blogs", "Travelogues"]
    },
    // {
    //     type: "Interactive",
    //     description: "A story that evolves based on reader choices, resulting in multiple possible paths or endings.",
    //     bestNarrativeStyles: [
    //         "Second Person",
    //         "First Person",
    //         "Third Person Limited"
    //     ],
    //     recommendedTones: [
    //         "Mysterious",
    //         "Suspenseful",
    //         "Adventurous",
    //         "Tense",
    //         "Playful",
    //         "Dramatic",
    //         "Exciting"
    //     ],
    //     recommendedGenres: [
    //         "Action",
    //         "Adventure",
    //         "Crime",
    //         "Dystopian",
    //         "Fantasy",
    //         "Mystery",
    //         "Science Fiction",
    //         "Suspense",
    //         "Thriller",
    //         "Time Travel"
    //     ],
    //     examples: ["Black Mirror: Bandersnatch", "Life is Strange", "Detroit: Become Human"]
    // },
    // {
    //     type: "Script/Screenplay",
    //     description: "Writing meant for performance in film, theatre, or TV, focusing on dialogue and scene direction.",
    //     bestNarrativeStyles: [
    //         "Third Person Objective",
    //         "Third Person Limited",
    //         "Multiple First Person"
    //     ],
    //     recommendedTones: [
    //         "Serious",
    //         "Humorous",
    //         "Lighthearted",
    //         "Dark",
    //         "Dramatic",
    //         "Tense",
    //         "Sarcastic",
    //         "Tragic",
    //         "Comedic"
    //     ],
    //     recommendedGenres: [
    //         "Action",
    //         "Comedy",
    //         "Crime",
    //         "Drama",
    //         "Historical",
    //         "Mystery",
    //         "Romance",
    //         "Science Fiction",
    //         "Thriller",
    //         "Tragedy"
    //     ],
    //     examples: ["Breaking Bad", "Inception", "The Office"]
    // },
    // {
    //     type: "Poetry",
    //     description: "Expressive writing that uses rhythm, imagery, and structure to evoke emotions and ideas.",
    //     bestNarrativeStyles: [
    //         "First Person",
    //         "Second Person",
    //         "Stream of Consciousness",
    //         "Collective/Choral"
    //     ],
    //     recommendedTones: [
    //         "Optimistic",
    //         "Pessimistic",
    //         "Melancholic",
    //         "Romantic",
    //         "Nostalgic",
    //         "Philosophical",
    //         "Hopeful",
    //         "Tragic",
    //         "Whimsical",
    //         "Reflective",
    //         "Somber",
    //         "Sentimental"
    //     ],
    //     recommendedGenres: [
    //         "Poetry",
    //         "Experimental",
    //         "Philosophical"
    //     ],
    //     examples: ["The Raven by Edgar Allan Poe", "Milk and Honey by Rupi Kaur"]
    // },
    
];



export const contentTypeList = contentTypes.map((item) => {
    return {
        id: item.type,
        label: item.type,
        value: item.type,
        description: item.description,
        bestNarrativeStyles: item.bestNarrativeStyles,
        recommendedTones: item.recommendedTones,
        recommendedGenres: item.recommendedGenres,
        examples: item.examples
    }
});