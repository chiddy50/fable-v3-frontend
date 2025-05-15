export const narrativeStyles = [
    {
        name: "First-Person",
        slug: "first-person",
        definition: "A narrative told from the perspective of a character within the story, using 'I', 'me', and 'my' pronouns.",
        examples: ["The Great Gatsby", "The Catcher in the Rye", "Gone Girl", "Memento (film)", "Fight Club (film)"],
        explanation: "First-person narration creates an intimate connection with the reader, as if they're receiving a personal account. However, the reader can only know what the narrator knows, which can create unreliable narration when the narrator has limited knowledge or deliberately misleads."
    },
    {
        name: "Second-Person",
        name: "second-person",
        definition: "A narrative that addresses the reader directly using 'you' pronouns, making them a character in the story.",
        examples: ["Bright Lights, Big City", "Half Asleep in Frog Pajamas", "Choose Your Own Adventure books", "Homestuck (web comic)", "Jay-Z's '99 Problems' (song)"],
        explanation: "Second-person narration creates an immersive experience by placing readers directly in the story. It's challenging to maintain but can be powerful for interactive fiction, self-help guides, or creating an unusual, intimate atmosphere."
    },
    {
        name: "Third-Person Limited",
        slug: "third-person-limited",
        definition: "A narrative told from outside the story but limited to the thoughts and experiences of one character at a time.",
        examples: ["Harry Potter series", "The Hunger Games", "Pride and Prejudice", "The Shawshank Redemption (film)", "Breaking Bad (TV series)"],
        explanation: "This style allows readers to understand one character deeply while maintaining some narrative distance. The narrator only reveals what the focal character knows, creating suspense and allowing for character development through their specific viewpoint."
    },
    {
        name: "Third-Person Omniscient",
        slug: "third-person-omniscient",
        definition: "A narrative told by an all-knowing narrator who can access the thoughts and feelings of all characters.",
        examples: ["War and Peace", "Middlemarch", "The Lord of the Rings", "Game of Thrones (TV series)", "The Godfather (film)"],
        explanation: "Omniscient narration provides a god-like perspective with complete access to all characters' minds and motivations. This allows for complex narratives with multiple plotlines and characters, giving readers a comprehensive understanding of the story world."
    },
    {
        name: "Stream of Consciousness",
        slug: "stream-of-consciousness",
        definition: "A narrative technique that presents a character's thoughts as a continuous, often disjointed flow, mimicking how thoughts actually occur in the mind.",
        examples: ["Ulysses", "Mrs. Dalloway", "The Sound and the Fury", "Eternal Sunshine of the Spotless Mind (film)", "Terrence Malick's films"],
        explanation: "Stream of consciousness immerses readers in a character's raw, unfiltered thoughts. It can be challenging to follow but provides unparalleled psychological depth and intimacy with characters, revealing their associations, memories, and thought patterns."
    },
    {
        name: "Epistolary",
        slug: "epistolary",
        definition: "A narrative told through a series of documents such as letters, diary entries, news articles, or modern equivalents like emails or text messages.",
        examples: ["Dracula", "The Color Purple", "Frankenstein", "World War Z", "Found footage films like 'The Blair Witch Project'"],
        explanation: "Epistolary narration creates authenticity through 'found' documents. It can build suspense by providing multiple perspectives on events and allows characters to express themselves directly without an intermediary narrator."
    },
    {
        name: "Frame Narrative",
        slug: "frame-narrative",
        definition: "A story within a story, where an initial narrative sets up a frame for the main story to be told.",
        examples: ["Wuthering Heights", "Heart of Darkness", "The Princess Bride", "Inception (film)", "The Grand Budapest Hotel (film)"],
        explanation: "Frame narratives add layers of meaning by establishing connections between different stories or time periods. They often feature a narrator recounting past events, adding perspective and authenticity while creating distance between the reader and the inner story."
    },
    {
        name: "Unreliable Narrator",
        slug: "unreliable-narrator",
        definition: "A narrator whose credibility is compromised, either deliberately or due to limited knowledge, bias, or psychological condition.",
        examples: ["The Tell-Tale Heart", "Lolita", "Fight Club", "Shutter Island (film)", "Mr. Robot (TV series)"],
        explanation: "Unreliable narrators create tension between what's presented and what's true. The reader must piece together reality from clues in the text, making for engaging, puzzle-like reading experiences. This technique often explores themes of deception, perception, and the nature of truth."
    },
    {
        name: "Multiple Viewpoints",
        slug: "multiple-viewpoints",
        definition: "A narrative that alternates between different characters' perspectives, either in first or third person.",
        examples: ["As I Lay Dying", "A Song of Ice and Fire series", "The Girl on the Train", "Rashomon (film)", "This Is Us (TV series)"],
        explanation: "Multiple viewpoints provide a comprehensive view of events from different angles. This creates dramatic irony when readers know more than any single character, builds complex characterization through contrasting perspectives, and works well for ensemble casts or complex plots."
    },
    {
        name: "Objective/Dramatic",
        slug: "objective-dramatic",
        definition: "A detached narrative style that reports only what can be seen and heard, without access to characters' thoughts or feelings.",
        examples: ["Hills Like White Elephants", "The Killers", "For Whom the Bell Tolls", "Lost in Translation (film)", "No Country for Old Men (film)"],
        explanation: "Objective narration functions like a camera, recording only observable details. This creates distance and ambiguity, requiring readers to interpret characters' emotions and motivations through dialogue and actions alone, often resulting in minimalist but powerful storytelling."
    },
    {
        name: "Nonlinear",
        slug: "nonlinear",
        definition: "A narrative that doesn't follow chronological order, instead jumping between different time periods or events.",
        examples: ["Slaughterhouse-Five", "Catch-22", "Cloud Atlas", "Pulp Fiction (film)", "Westworld (TV series)"],
        explanation: "Nonlinear storytelling creates thematic connections across time periods and can mirror characters' psychological states. It challenges readers to reassemble the timeline, emphasizes patterns and parallels, and can create suspense by withholding key information until precisely the right moment."
    },
    {
        name: "Magical Realism",
        slug: "magical-realism",
        definition: "A narrative style where magical or fantastical elements appear in an otherwise realistic setting without explanation or surprise from characters.",
        examples: ["One Hundred Years of Solitude", "Beloved", "The House of the Spirits", "Pan's Labyrinth (film)", "Midnight in Paris (film)"],
        explanation: "Magical realism blends the mundane with the miraculous, treating extraordinary elements as ordinary. This technique often explores cultural identity, political resistance, and emotional truths through metaphorical impossible events, creating a dreamlike quality that highlights the wonder of everyday life."
    },
    {
        name: "Metafiction",
        slug: "metafiction",
        definition: "Self-aware fiction that draws attention to its own artifice and the relationship between fiction and reality.",
        examples: ["Don Quixote", "If on a winter's night a traveler", "Adaptation (film)", "The Truman Show (film)", "Deadpool (film)"],
        explanation: "Metafiction breaks the fourth wall by acknowledging its status as fiction. It explores the nature of storytelling itself, often through narrators who address readers directly, stories-within-stories, or characters aware they're in a fictional work. This creates a playful relationship with readers about the construction of narrative."
    },
    {
        name: "Allegory",
        slug: "allegory",
        definition: "A narrative in which characters, settings, and events stand for abstract ideas or moral qualities, creating a story with both literal and symbolic meanings.",
        examples: ["Animal Farm", "The Chronicles of Narnia", "Lord of the Flies", "The Matrix (film)", "WALL-E (film)"],
        explanation: "Allegory uses fictional elements to represent real-world concepts, often political or philosophical ideas. Characters might represent virtues, vices, or social groups, allowing writers to address controversial topics indirectly. The surface story can be enjoyed independently, but deeper meanings emerge through symbolic interpretation."
    },
    {
        name: "Vignette",
        slug: "vignette",
        definition: "Brief, impressionistic scenes that focus on a moment or give a particular insight into a character, idea, or setting rather than telling a traditional story.",
        examples: ["The House on Mango Street", "Winesburg, Ohio", "Olive Kitteridge", "Night on Earth (film)", "Black Mirror (TV series)"],
        explanation: "Vignettes are like snapshots that capture fleeting moments or impressions. Rather than following a plot arc, they build meaning through accumulation and juxtaposition. This style often emphasizes atmosphere, emotion, and character over plot, creating a mosaic-like effect when collected together."
    },
    {
        name: "Bildungsroman",
        slug: "bildungsroman",
        definition: "A narrative that focuses on the psychological and moral growth of the protagonist from youth to adulthood.",
        examples: ["Great Expectations", "To Kill a Mockingbird", "The Catcher in the Rye", "Boyhood (film)", "Lady Bird (film)"],
        explanation: "Bildungsroman (meaning 'formation novel' in German) traces a character's journey from innocence to experience. These coming-of-age stories focus on identity formation, often featuring formative encounters with love, loss, societal expectations, and moral challenges that shape the protagonist's worldview and character."
    },
    {
        name: "Picaresque",
        slug: "picaresque",
        definition: "A narrative following the adventures of a roguish hero of low social status who lives by their wits in a corrupt society.",
        examples: ["Don Quixote", "The Adventures of Huckleberry Finn", "Candide", "Forrest Gump (film)", "O Brother, Where Art Thou? (film)"],
        explanation: "Picaresque narratives feature episodic adventures as the protagonist travels through different social settings. Often satirical, these stories use the hero's encounters with various social classes to critique society. The main character rarely develops significantly but serves as a constant lens through which to view a wide range of environments and people."
    },
    {
        name: "In Medias Res",
        slug: "in-medias-res",
        definition: "A narrative that begins in the middle of the action, later filling in the backstory through flashbacks or exposition.",
        examples: ["The Odyssey", "Paradise Lost", "Catch-22", "The Usual Suspects (film)", "Breaking Bad (TV series)"],
        explanation: "In medias res (Latin for 'into the middle of things') creates immediate engagement by thrusting readers into an exciting or pivotal moment. The narrative then moves back and forth between present action and past events, creating tension between what happened before and what might happen next."
    },
    {
        name: "Polyphonic",
        slug: "polyphonic",
        definition: "A narrative featuring multiple voices of equal importance, with no single dominant perspective controlling the story.",
        examples: ["The Brothers Karamazov", "As I Lay Dying", "Pale Fire", "Nashville (film)", "Magnolia (film)"],
        explanation: "Polyphonic narratives present multiple independent voices rather than subordinating them to a main perspective. Each character's voice maintains its uniqueness and autonomy, creating a democratic narrative space. This technique excels at depicting complex social environments and exploring how different worldviews interact and conflict."
    },
    {
        name: "Oral Storytelling",
        slug: "oral-storytelling",
        definition: "A narrative style that mimics spoken traditions, often featuring repetition, direct address to listeners, and a conversational tone.",
        examples: ["Things Fall Apart", "Thousand and One Nights", "Their Eyes Were Watching God", "Big Fish (film)", "The Princess Bride (film)"],
        explanation: "Oral storytelling captures the rhythms and conventions of spoken tales. These narratives often include callbacks, refrains, and rhetorical questions that engage the reader as a listener. This style creates intimacy by simulating the presence of a storyteller and honors traditional narrative forms from cultures worldwide."
    }
];

export default narrativeStyles;