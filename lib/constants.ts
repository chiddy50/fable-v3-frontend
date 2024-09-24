export const storyBuilderSteps = [
    {
      title: 'Setting',
      link: 'story-starter',
      step: 1,
    },
    {
        title: 'Plot',
        link: 'story-plot',
        step: 2,
    },
    {
        title: 'Characters',
        link: 'create-characters',
        step: 3,
    },
    {
        title: 'Story',
        link: 'finish-story',
        step: 4,
    },
    // {
    //     title: 'Scenes',
    //     link: 'create-scene',
    //     step: 5,
    // },
];

export const plotElements = [
    {
        label: "Exposition",
        value: "exposition",
        description: "Exposition is the beginning of your story, where you set the stage for the narrative. It provides context, introduces characters, and establishes the story's tone."
    },
    {
        label: "Startling Questions",
        value: "startlingQuestions",
        description: "Engages the reader by posing intriguing questions early in the story, setting up curiosity and anticipation for the unfolding narrative."
    },
    {
        label: "Background",
        value: "background",
        description: "Provides context about characters, the world, or historical events. This helps create a richer understanding of the story and its setting."
    },
    {
        label: "Inciting Incident",
        value: "incitingIncidents",
        description: "The event that triggers the main conflict of the story, disrupting the status quo and propelling the protagonist into action."
    },
    // {
    //     label: "Plot Twist",
    //     value: "plotTwist",
    //     description: "A sudden and unexpected change in the direction of the story, often used to surprise the reader and keep the plot engaging."
    // },
    {
        label: "Rising Action",
        value: "risingAction",
        description: "The series of events that build tension and develop the central conflict, leading up to the climax of the story."
    },
    {
        label: "Mini-Climaxes",
        value: "miniClimaxes",
        description: "Smaller moments of tension and resolution that occur before the main climax, keeping the reader engaged and adding depth to the plot."
    },
    {
        label: "Foreshadowing",
        value: "foreshadowing",
        description: "Hints or clues about events that will occur later in the story, helping to build suspense and prepare the reader for what's to come."
    },
    {
        label: "Climax",
        value: "climax",
        description: "The most intense and critical moment in the story where the main conflict reaches its peak and the outcome is decided."
    },
    {
        label: "Falling Action",
        value: "fallingAction",
        description: "The events that follow the climax, showing the consequences of the protagonist's actions and beginning to resolve the story's conflicts."
    },
    {
        label: "Resolution (Denouement)",
        value: "resolution",
        description: "The conclusion of the story where the main conflict is resolved, loose ends are tied up, and a sense of closure is provided."
    },
    {
        label: "Conclusion",
        value: "conclusion",
        description: "Summarizes the story and its themes, often reflecting on the protagonist's journey and the lessons learned."
    },
    {
        label: "Character Arcs",
        value: "characterArcs",
        description: "The development and transformation of characters throughout the story, showing how they change in response to the events of the plot."
    },
    {
        label: "Subplots and Threads",
        value: "subplots",
        description: "Secondary storylines that run alongside the main plot, adding complexity and depth to the narrative."
    },
    {
        label: "Emotional Connection",
        value: "emotionalConnection",
        description: "Creating empathy and resonance with the characters and their struggles, making the reader emotionally invested in the story."
    }
];

export const threeActStructure = [
    {
        step: 1,
        label: 'The Hook',
        value: 'hook',
        parent: 'Act One',
    },
    {
        step: 2,
        label: 'Inciting Event',
        value: 'incitingEvent',
        parent: 'Act One',
    },
    {
        step: 3,
        label: '1st Plot Point',
        value: 'firstPlotPoint',
        parent: 'Act One',
    },
    {
        step: 4,
        label: '1st Pinch Point',
        value: 'firstPinchPoint',
        parent: 'Act Two',
    },
    {
        step: 5,
        label: 'Midpoint',
        value: 'midpoint',
        parent: 'Act Two',
    },
    {
        step: 6,
        label: '2nd Pinch Point',
        value: 'secondPinchPoint',
        parent: 'Act Two',
    },
    {
        step: 7,
        label: '3rd Plot Point',
        value: 'thirdPlotPoint',
        parent: 'Act Three',
    },
    {
        step: 8,
        label: 'The Climax',
        value: 'climax',
        parent: 'Act Three',
    }
]