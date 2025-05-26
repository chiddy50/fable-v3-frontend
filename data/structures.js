// Novel Structures
const novelStructures = [
    {
        id: 'three-act-novel',
        title: 'Three-Act',
        label: 'Three-Act Structure',
        type: "Novel",
        chapterAmount: 12,
        chapters: [
            {
                title: "Beginning of the Normal World",
                objective: "Establish the protagonist and their ordinary world before the main conflict",
                wordCount: "3000-5000",
                questionsToAnswer: [
                    "Who is your protagonist?",
                    "What is their normal life like?",
                    "What are their strengths, flaws, and desires?"
                ]
            },
            {
                title: "The Inciting Incident",
                objective: "Introduce the event that disturbs the status quo and sets the story in motion",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What disrupts your protagonist's world?",
                    "How does your protagonist initially react?",
                    "What's at stake if they don't respond to this challenge?"
                ]
            },
            {
                title: "First Plot Point",
                objective: "The protagonist makes a decision that propels them into the main conflict",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What choice does your protagonist make?",
                    "What do they commit to?",
                    "What's the point of no return?"
                ]
            },
            {
                title: "Rising Obstacles",
                objective: "The protagonist faces early challenges in their new situation",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What obstacles does your protagonist encounter?",
                    "How do these challenges test them?",
                    "What new allies or enemies appear?"
                ]
            },
            {
                title: "First Pinch Point",
                objective: "A reminder of the antagonistic forces at work, raising the stakes",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How does the antagonist show their power?",
                    "What new danger or complication appears?",
                    "How does this increase the stakes?"
                ]
            },
            {
                title: "Midpoint Shift",
                objective: "A major revelation or event that changes the protagonist's understanding or approach",
                wordCount: "4500-7000",
                questionsToAnswer: [
                    "What major reveal or shift occurs?",
                    "How does this change the protagonist's perspective?",
                    "How do their goals or methods change as a result?"
                ]
            },
            {
                title: "Rising Complications",
                objective: "Increased difficulty as the protagonist's new approach faces stronger resistance",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "How do the stakes continue to escalate?",
                    "What new complications arise?",
                    "How is the protagonist's resolve tested?"
                ]
            },
            {
                title: "Second Pinch Point",
                objective: "Another demonstration of antagonistic force, now stronger than before",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How does the antagonist strike back?",
                    "What setbacks does the protagonist suffer?",
                    "What resources or allies are lost?"
                ]
            },
            {
                title: "All is Lost Moment",
                objective: "The protagonist's darkest hour where failure seems inevitable",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What major defeat occurs?",
                    "What does the protagonist lose?",
                    "Why does all hope seem lost?"
                ]
            },
            {
                title: "Renewed Push",
                objective: "The protagonist finds new resolve and prepares for the final confrontation",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How does the protagonist recover?",
                    "What new understanding or resources do they gain?",
                    "How do they prepare for the final battle?"
                ]
            },
            {
                title: "Climax",
                objective: "The final confrontation where the main conflict is resolved",
                wordCount: "5000-8000",
                questionsToAnswer: [
                    "How does the final confrontation unfold?",
                    "What ultimate challenge must the protagonist overcome?",
                    "How do they apply what they've learned throughout their journey?"
                ]
            },
            {
                title: "Resolution",
                objective: "Show the new normal and the consequences of the protagonist's journey",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "How has the world changed?",
                    "How has the protagonist changed?",
                    "What new equilibrium is established?"
                ]
            }
        ],
        description: 'A classic beginning, middle, and end structure divided into setup, confrontation, and resolution. Perfect for traditional storytelling with clear dramatic arcs.',
        examples: 'Star Wars, The Hunger Games, Harry Potter',
        image: '/img/story-structures/three-act2.png',
        learnMoreUrl: '/learn/three-act-structure',
        bestGenres: [
			"Drama",
			"Crime",
			"Romance",
			"Thriller",
			"War"
		],
		recommendedTones: [
			"Dramatic",
			"Serious",
			"Resolute",
			"Authoritative",
			"Varied"
		],
		moreDescription: "The versatile workhorse structure that fits most mainstream genres",
        suggestedContentType: {
            name: "Both",
            reason: "The setup-conflict-resolution pattern works for fictional stories and true stories like business cases, historical events, or personal journeys."
        }
    },

    {
        id: 'heros-journey',
        title: "Hero's Journey",
        label: "Hero's Journey",
        type: "Novel",
        chapterAmount: 12,
        chapters: [
            {
                title: "The Ordinary World",
                objective: "Establish the hero's normal life and limitations before the adventure begins",
                wordCount: "3000-5000",
                questionsToAnswer: [
                    "What is your hero's everyday life like?",
                    "What limitations or problems do they face?",
                    "What sets them apart from others in their world?"
                ]
            },
            {
                title: "The Call to Adventure",
                objective: "Present the inciting incident that disrupts the ordinary world",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What event or messenger calls the hero to adventure?",
                    "What challenge or opportunity presents itself?",
                    "How does this call disrupt the hero's normal life?"
                ]
            },
            {
                title: "Refusal of the Call",
                objective: "Show the hero's reluctance or fear toward accepting the challenge",
                wordCount: "2000-3500",
                questionsToAnswer: [
                    "Why does the hero hesitate to accept the adventure?",
                    "What fears or doubts hold them back?",
                    "What are the consequences of refusing the call?"
                ]
            },
            {
                title: "Meeting the Mentor",
                objective: "Introduce a guiding figure who provides wisdom, training, or gifts",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "Who helps prepare the hero for their journey?",
                    "What wisdom, tools, or gifts does the mentor provide?",
                    "How does the mentor push the hero to accept the adventure?"
                ]
            },
            {
                title: "Crossing the Threshold",
                objective: "The hero commits to the adventure and enters the special world",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What decision marks the point of no return?",
                    "How does the hero leave their ordinary world behind?",
                    "What immediate challenges face them in this new realm?"
                ]
            },
            {
                title: "Tests, Allies, and Enemies",
                objective: "The hero faces early challenges and builds a supporting cast",
                wordCount: "5000-8000",
                questionsToAnswer: [
                    "What trials test the hero's resolve and abilities?",
                    "Who joins the hero's cause, and why?",
                    "What opposition surfaces, and what are their motivations?"
                ]
            },
            {
                title: "Approach to the Inmost Cave",
                objective: "The hero prepares for the major challenge ahead",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What final preparations does the hero make?",
                    "What is the plan of attack?",
                    "What dangers lurk at the threshold of the central ordeal?"
                ]
            },
            {
                title: "The Ordeal",
                objective: "The hero faces death or their greatest fear in a central crisis",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What supreme test must the hero face?",
                    "How does the hero confront death or their greatest fear?",
                    "What transformation occurs as a result of this crisis?"
                ]
            },
            {
                title: "Reward (Seizing the Sword)",
                objective: "The hero gains something important after surviving the ordeal",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What does the hero gain from their victory?",
                    "How do they celebrate or reflect on their achievement?",
                    "What new insights or powers do they now possess?"
                ]
            },
            {
                title: "The Road Back",
                objective: "The hero begins the journey back to the ordinary world",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What motivates the hero to return home?",
                    "What new dangers or temptations threaten this return?",
                    "How are they pursued by the consequences of their adventure?"
                ]
            },
            {
                title: "Resurrection",
                objective: "The hero faces a final test that requires everything they've learned",
                wordCount: "4500-7000",
                questionsToAnswer: [
                    "What final, climactic challenge must the hero overcome?",
                    "How do they apply everything they've learned?",
                    "What ultimate transformation occurs as a result?"
                ]
            },
            {
                title: "Return with the Elixir",
                objective: "The hero returns home transformed, bringing something to benefit their community",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "How has the hero changed compared to when they started?",
                    "What gift or wisdom do they bring back to their ordinary world?",
                    "How does this change benefit their community?"
                ]
            }
        ],
        description: 'A mythic structure popularized by Joseph Campbell that follows a protagonist through departure, initiation, and return. Ideal for epic tales of transformation and adventure.',
        examples: 'The Lord of the Rings, The Matrix, The Lion King',
        image: '/img/story-structures/hero-journey2.png',
        learnMoreUrl: '/learn/heros-journey',
        bestGenres: [
			"Fantasy",
			"Adventure",
			"Science Fiction",
			"Mythology",
			"Coming-of-Age"
		],
		recommendedTones: [
			"Heroic",
			"Inspirational",
			"Adventurous",
			"Dramatic",
			"Uplifting"
		],
		moreDescription: "Perfect for epic quests and character transformation stories",
        suggestedContentType: {
            name: "Fiction",
            reason: "Focuses on a character's personal transformation through challenges, which works best with imaginary heroes and adventures."
        }
    },

    {
        id: 'five-act',
        title: 'Five-Act',
        label: 'Five-Act Structure',
        type: "Novel",
        chapterAmount: 10,
        chapters: [
            {
                title: "Exposition Part I",
                objective: "Introduce the setting, main characters, and establish the status quo",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "Where and when does your story take place?",
                    "Who are the key characters and what defines them?",
                    "What is the current state of affairs before disruption?"
                ]
            },
            {
                title: "Exposition Part II",
                objective: "Plant the seeds of conflict and foreshadow coming events",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What tensions exist beneath the surface?",
                    "What hints of coming trouble can you introduce?",
                    "Which character relationships are most important to establish?"
                ]
            },
            {
                title: "Rising Action Part I",
                objective: "Introduce the inciting incident and early complications",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What event disrupts the status quo?",
                    "How do characters initially respond to this change?",
                    "What early obstacles appear?"
                ]
            },
            {
                title: "Rising Action Part II",
                objective: "Escalate conflicts and develop subplots",
                wordCount: "4500-6500",
                questionsToAnswer: [
                    "How do complications multiply or intensify?",
                    "What secondary conflicts emerge?",
                    "How are character relationships tested or changed?"
                ]
            },
            {
                title: "Climax Part I",
                objective: "Build toward the turning point of the story",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What events lead to the crisis point?",
                    "How are the stakes raised to their highest level?",
                    "What difficult choices must characters make?"
                ]
            },
            {
                title: "Climax Part II",
                objective: "Present the critical moment where the conflict reaches its peak",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What is the moment of highest tension?",
                    "What irreversible actions are taken?",
                    "How does this moment change everything that follows?"
                ]
            },
            {
                title: "Falling Action Part I",
                objective: "Show the immediate consequences of the climax",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How do characters react to the climactic events?",
                    "What new equilibrium begins to form?",
                    "Which conflicts start to resolve?"
                ]
            },
            {
                title: "Falling Action Part II",
                objective: "Begin resolving secondary conflicts and subplots",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "How are loose ends being tied up?",
                    "What remaining obstacles must be overcome?",
                    "How do character arcs progress toward completion?"
                ]
            },
            {
                title: "Denouement Part I",
                objective: "Resolve the main conflict and show its aftermath",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How is the central conflict finally resolved?",
                    "What price has been paid to reach this resolution?",
                    "What lessons have been learned?"
                ]
            },
            {
                title: "Denouement Part II",
                objective: "Establish the new normal and conclude character arcs",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What is the new status quo?",
                    "How have characters changed from beginning to end?",
                    "What final image or scene encapsulates the story's theme?"
                ]
            }
        ],
        description: 'A dramatic structure with five distinct parts: exposition, rising action, climax, falling action, and denouement. Best for complex narratives with multiple subplots.',
        examples: 'Shakespearean plays, Pride and Prejudice, Game of Thrones',
        image: '/img/story-structures/five-act.png',
        learnMoreUrl: '/learn/five-act-structure',
        bestGenres: [
			"Historical",
			"Literary Fiction",
			"Political Thriller",
			"Biographical",
			"War"
		],
		recommendedTones: [
			"Formal",
			"Serious",
			"Dramatic",
			"Authoritative",
			"Tragic"
		],
		moreDescription: "Allows for extended development and complex character exploration",
        suggestedContentType: {
            name: "Both",
            reason: "The extended dramatic arc suits complex fictional plots but also works well for detailed biographies, historical accounts, or business stories."
        }
    },

    {
        id: 'freytags-pyramid-novel',
        title: "Freytag's Pyramid",
        label: "Freytag's Pyramid",
        type: "Novel",
        chapterAmount: 10,
        chapters: [
            {
                title: "Exposition - Introduction",
                objective: "Establish the setting, introduce main characters, and set the stage",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "Where and when does your story take place?",
                    "Who is your protagonist and what defines them?",
                    "What is the current state of affairs before any disruption?"
                ]
            },
            {
                title: "Exposition - Background",
                objective: "Provide necessary background information and develop character relationships",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What is the relevant history of your characters?",
                    "What relationships are most important to establish?",
                    "What normal routines or situations need to be understood?"
                ]
            },
            {
                title: "Rising Action - Inciting Incident",
                objective: "Introduce the event that sets the main conflict in motion",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What event disrupts the status quo?",
                    "How does your protagonist initially react?",
                    "What first complications appear as a result?"
                ]
            },
            {
                title: "Rising Action - Complications",
                objective: "Escalate the conflict through increasing obstacles and stakes",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What obstacles stand in the protagonist's way?",
                    "How do the stakes increase?",
                    "What new information comes to light?"
                ]
            },
            {
                title: "Rising Action - Crisis Development",
                objective: "Build tension toward the climax through increasingly difficult challenges",
                wordCount: "4500-6500",
                questionsToAnswer: [
                    "How does the protagonist struggle against mounting odds?",
                    "What difficult choices must they make?",
                    "What setbacks do they experience?"
                ]
            },
            {
                title: "Climax",
                objective: "Present the turning point of maximum tension where the conflict is directly addressed",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What crucial confrontation occurs?",
                    "What decision or action represents the point of no return?",
                    "How is the protagonist fundamentally challenged?"
                ]
            },
            {
                title: "Falling Action - Immediate Aftermath",
                objective: "Show the immediate results of the climactic moment",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What are the immediate consequences of the climax?",
                    "How do characters react to what has happened?",
                    "What tensions begin to resolve?"
                ]
            },
            {
                title: "Falling Action - Loose Ends",
                objective: "Address secondary conflicts and begin resolving plot threads",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What remaining questions need answers?",
                    "How are secondary conflicts addressed?",
                    "What character arcs move toward completion?"
                ]
            },
            {
                title: "Resolution - Outcomes",
                objective: "Reveal the final outcomes of the story's events",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "How is the central conflict ultimately resolved?",
                    "What price has been paid?",
                    "What rewards are gained?"
                ]
            },
            {
                title: "Resolution - New Normal",
                objective: "Show the new equilibrium and conclude character transformations",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What is the new status quo?",
                    "How have characters been transformed?",
                    "What final image or message encapsulates the story's theme?"
                ]
            }
        ],
        description: 'A dramatic structure that follows exposition, rising action, climax, falling action, and denouement in a clear arc. Excellent for stories with a single main conflict and strong emotional impact.',
        examples: 'Romeo and Juliet, To Kill a Mockingbird, The Great Gatsby',
        image: '/img/story-structures/freytag-pyramid.png',
        learnMoreUrl: '/learn/freytags-pyramid',
        bestGenres: [
			"Tragedy",
			"Drama",
			"Gothic",
			"Historical",
			"Literary Fiction"
		],
		recommendedTones: [
			"Tragic",
			"Dramatic",
			"Serious",
			"Somber",
			"Formal"
		],
		moreDescription: "Classical dramatic structure with emphasis on rising and falling action",
        suggestedContentType: {
            name: "Fiction",
            reason: "Created specifically for dramatic plays and stories with rising action and climax, which is hard to guarantee in real-life events."
        }
    },

    {
        id: 'seven-point',
        title: 'Seven-Point',
        label: 'Seven-Point Structure',
        type: "Novel",
        chapterAmount: 10,
        chapters: [
            {
                title: "Hook",
                objective: "Introduce the protagonist and establish the initial situation that draws readers in",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "Who is your protagonist?",
                    "What makes them interesting or relatable?",
                    "What normal situation sets the stage before disruption?"
                ]
            },
            {
                title: "Plot Turn 1 - Part I",
                objective: "Present the inciting incident that pushes the protagonist into the main conflict",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What event forces your protagonist out of their comfort zone?",
                    "What problem must they now solve?",
                    "How do they initially react to this change?"
                ]
            },
            {
                title: "Plot Turn 1 - Part II",
                objective: "Show the protagonist's commitment to addressing the conflict",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What decision does the protagonist make to engage with the problem?",
                    "What goal do they set for themselves?",
                    "What is their initial plan or approach?"
                ]
            },
            {
                title: "Pinch Point 1",
                objective: "Introduce a major setback or revelation of the antagonistic force",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What obstacle or opposition reveals its strength?",
                    "What setback does the protagonist face?",
                    "How does this raise the stakes?"
                ]
            },
            {
                title: "Midpoint",
                objective: "Present a pivotal moment where the protagonist shifts from reaction to action",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What revelation changes the protagonist's understanding?",
                    "How does their approach or goal change?",
                    "What transition occurs from reactive to proactive behavior?"
                ]
            },
            {
                title: "Pinch Point 2",
                objective: "Deliver a stronger blow that forces the protagonist to fully commit",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What major setback or crisis occurs?",
                    "What is lost or at risk?",
                    "Why must the protagonist now go all-in?"
                ]
            },
            {
                title: "Plot Turn 2 - Part I",
                objective: "Show the protagonist gaining the final piece needed to resolve the conflict",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What key insight, tool, or ally does the protagonist acquire?",
                    "How does this prepare them for the final confrontation?",
                    "What remaining doubts must be overcome?"
                ]
            },
            {
                title: "Plot Turn 2 - Part II",
                objective: "Position the protagonist for the final battle",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "How does the protagonist prepare for the final confrontation?",
                    "What last-minute complications arise?",
                    "What is the plan of attack?"
                ]
            },
            {
                title: "Resolution - Climax",
                objective: "Present the final confrontation where the main conflict is resolved",
                wordCount: "4500-7000",
                questionsToAnswer: [
                    "How does the final confrontation unfold?",
                    "How does the protagonist use what they've learned?",
                    "What difficult choices must they make?"
                ]
            },
            {
                title: "Resolution - Aftermath",
                objective: "Show the consequences of the resolution and the new normal",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "How has the world changed?",
                    "How has the protagonist changed?",
                    "What lessons have been learned or truths revealed?"
                ]
            }
        ],
        description: 'A structure with seven key moments: hook, plot turn 1, pinch point 1, midpoint, pinch point 2, plot turn 2, and resolution. Excellent for plotting stories with clear cause-and-effect progression.',
        examples: 'The Hunger Games, Harry Potter, The Martian',
        image: '/img/story-structures/seven-point.png',
        learnMoreUrl: '/learn/seven-point-structure',
        bestGenres: [
			"Fantasy",
			"Science Fiction",
			"Mystery",
			"Adventure",
			"Young Adult"
		],
		recommendedTones: [
			"Adventurous",
			"Dramatic",
			"Exciting",
			"Heroic",
			"Confident"
		],
		moreDescription: "Provides detailed scaffolding for complex plots and character development",
        suggestedContentType: {
            name: "Both",
            reason: "The detailed plot points help organize complex fictional adventures, but also work for structuring how-to guides, case studies, or educational content."
        }
    },

    {
        id: 'save-the-cat',
        title: 'Save the Cat',
        label: 'Save the Cat! Beat Sheet',
        type: "Novel",
        chapterAmount: 15,
        chapters: [
            {
                title: "Opening Image",
                objective: "Establish a starting snapshot that sets the tone and mood of the story",
                wordCount: "1500-2500",
                questionsToAnswer: [
                    "What visual or scenario best represents the protagonist's world before change?",
                    "What tone or mood should be established?",
                    "What theme or problem is visually suggested?"
                ]
            },
            {
                title: "Theme Stated",
                objective: "Have a character state the theme or central question of the story",
                wordCount: "1500-2500",
                questionsToAnswer: [
                    "What is the central theme of your story?",
                    "Who can voice this theme (often not the protagonist)?",
                    "How can this be stated in dialogue that doesn't feel forced?"
                ]
            },
            {
                title: "Setup",
                objective: "Establish the protagonist's world, flaws, and what needs fixing in their life",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What is your protagonist's status quo?",
                    "What problems or flaws do they have?",
                    "What aspects of their life need improvement?"
                ]
            },
            {
                title: "Catalyst",
                objective: "Introduce the inciting incident that disrupts the protagonist's world",
                wordCount: "2000-3000",
                questionsToAnswer: [
                    "What unexpected event changes everything?",
                    "How does this event force the protagonist into action?",
                    "What makes this moment impossible to ignore?"
                ]
            },
            {
                title: "Debate",
                objective: "Show the protagonist's reluctance and internal struggle before committing",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "Why does the protagonist hesitate to act?",
                    "What fears or doubts must they overcome?",
                    "What are the risks of both action and inaction?"
                ]
            },
            {
                title: "Break into Two",
                objective: "The protagonist makes a definitive choice to enter the new world or situation",
                wordCount: "2000-3000",
                questionsToAnswer: [
                    "What decision marks the point of no return?",
                    "How does the protagonist leave their comfort zone?",
                    "What new goal or approach do they adopt?"
                ]
            },
            {
                title: "B Story",
                objective: "Introduce a secondary storyline, often featuring a relationship that helps the protagonist",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "Who enters the story to help the protagonist learn?",
                    "What new relationship develops?",
                    "How will this relationship provide perspective on the theme?"
                ]
            },
            {
                title: "Fun and Games",
                objective: "Explore the premise and show the protagonist in the new world",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What entertaining scenarios showcase your story's premise?",
                    "How does the protagonist adapt to new challenges?",
                    "What moments deliver on the 'promise of the premise'?"
                ]
            },
            {
                title: "Midpoint",
                objective: "Present a major twist, raising stakes or changing the goal",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What revelation or event raises the stakes?",
                    "How does this change the protagonist's understanding?",
                    "Does this represent a false victory or false defeat?"
                ]
            },
            {
                title: "Bad Guys Close In",
                objective: "Show increasing external pressure and internal conflicts",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How do antagonistic forces gain ground?",
                    "What divisions appear among allies?",
                    "What internal doubts resurface for the protagonist?"
                ]
            },
            {
                title: "All Is Lost",
                objective: "Present the protagonist's darkest moment where all seems hopeless",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "What major defeat occurs?",
                    "What important loss happens (often mentor/ally)?",
                    "Why does success now seem impossible?"
                ]
            },
            {
                title: "Dark Night of the Soul",
                objective: "Show the protagonist at their lowest point, grappling with despair",
                wordCount: "2000-3500",
                questionsToAnswer: [
                    "How does the protagonist process their defeat?",
                    "What deeper truth must they confront?",
                    "What must they surrender or accept?"
                ]
            },
            {
                title: "Break into Three",
                objective: "The protagonist finds a new solution by combining external help and internal growth",
                wordCount: "2000-3000",
                questionsToAnswer: [
                    "What insight or inspiration provides new hope?",
                    "How do the A and B stories come together?",
                    "What new approach will the protagonist take?"
                ]
            },
            {
                title: "Finale",
                objective: "Show the protagonist executing their new plan and achieving transformation",
                wordCount: "4500-7000",
                questionsToAnswer: [
                    "How does the protagonist apply what they've learned?",
                    "How are antagonistic forces defeated?",
                    "How is the protagonist's character arc completed?"
                ]
            },
            {
                title: "Final Image",
                objective: "Present a closing snapshot that shows how much has changed since the opening",
                wordCount: "1500-2500",
                questionsToAnswer: [
                    "What visual or moment best shows the transformation that's occurred?",
                    "How does this callback to the opening image?",
                    "What final impression do you want to leave with readers?"
                ]
            }
        ],
        description: 'A detailed 15-beat story structure developed by screenwriter Blake Snyder. Highly effective for commercial fiction with emotional arcs and transformative character journeys.',
        examples: 'Most successful Hollywood films, The Fault in Our Stars, The Da Vinci Code',
        image: '/img/story-structures/save-the-cat.png',
        learnMoreUrl: '/learn/save-the-cat-structure',
        bestGenres: [
			"Action",
			"Adventure",
			"Thriller",
			"Romance",
			"Superhero"
		],
		recommendedTones: [
			"Exciting",
			"Heroic",
			"Dramatic",
			"Uplifting",
			"Confident"
		],
		moreDescription: "Excellent for commercial, fast-paced stories with clear character arcs",
        suggestedContentType: {
            name: "Fiction",
            reason: "Designed for movies and novels with clear heroes, villains, and dramatic plot points that are easier to control in made-up stories."
        }
    },

    {
        id: 'milieu-driven',
        title: 'Milieu-Driven',
        label: 'Milieu-Driven Structure',
        type: "Novel",
        chapterAmount: 12,
        chapters: [
            {
                title: "The Known World",
                objective: "Establish the protagonist's original world and their dissatisfaction or curiosity",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "What is the protagonist's normal environment?",
                    "What makes them dissatisfied or curious about what lies beyond it?",
                    "What constraints or rules define their current world?"
                ]
            },
            {
                title: "The Threshold",
                objective: "Show the protagonist's discovery or entry into a new world or setting",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "How does the protagonist discover or enter the strange world?",
                    "What immediate differences are apparent?",
                    "What initial challenges does entry present?"
                ]
            },
            {
                title: "Initial Explorations",
                objective: "Present the protagonist's first explorations and impressions of the new world",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What wonders or dangers does the protagonist first encounter?",
                    "Who or what serves as an initial guide?",
                    "What misconceptions does the protagonist have?"
                ]
            },
            {
                title: "First Challenges",
                objective: "Introduce the protagonist to the rules and challenges of the new world",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What first serious obstacle does the protagonist face?",
                    "What rules of this world cause difficulties?",
                    "What cultural misunderstandings occur?"
                ]
            },
            {
                title: "Deeper Understanding",
                objective: "Deepen the protagonist's engagement with the world and its inhabitants",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What relationships form with inhabitants of this world?",
                    "What deeper aspects of the world are revealed?",
                    "How does the protagonist's understanding evolve?"
                ]
            },
            {
                title: "The World's Conflict",
                objective: "Reveal larger tensions or conflicts within the new world",
                wordCount: "4500-6500",
                questionsToAnswer: [
                    "What deeper conflicts or tensions exist in this world?",
                    "How does the protagonist become involved in these issues?",
                    "What factions or opposing forces are at work?"
                ]
            },
            {
                title: "Critical Challenge",
                objective: "Present a major challenge that tests the protagonist's understanding of the world",
                wordCount: "4000-6000",
                questionsToAnswer: [
                    "What major crisis or challenge emerges?",
                    "How must the protagonist apply their knowledge of this world?",
                    "What's at stake for both the protagonist and this world?"
                ]
            },
            {
                title: "Deeper Secrets",
                objective: "Reveal hidden aspects or secrets of the world that change the protagonist's perspective",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What hidden truth comes to light?",
                    "How does this revelation change the protagonist's understanding?",
                    "What previous assumptions are challenged?"
                ]
            },
            {
                title: "Integration or Rejection",
                objective: "Show the protagonist's decision whether to integrate into this world or return home",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "Does the protagonist feel they belong in this world?",
                    "What pulls them toward staying or leaving?",
                    "What choice must they ultimately make?"
                ]
            },
            {
                title: "The Return Journey",
                objective: "Present the protagonist's journey back to their original world",
                wordCount: "3500-5000",
                questionsToAnswer: [
                    "What challenges arise during the return journey?",
                    "What aspects of the strange world follow the protagonist?",
                    "What has the protagonist gained that they bring back?"
                ]
            },
            {
                title: "Changed Perspective",
                objective: "Show how the protagonist views their original world differently after their experiences",
                wordCount: "3000-4500",
                questionsToAnswer: [
                    "How does the protagonist see their original world with new eyes?",
                    "What aspects of their journey continue to influence them?",
                    "What wisdom or artifacts have they brought back?"
                ]
            },
            {
                title: "New Equilibrium",
                objective: "Establish the new status quo and the protagonist's changed relationship to their world",
                wordCount: "2500-4000",
                questionsToAnswer: [
                    "How has the protagonist changed through their journey?",
                    "How do they apply what they've learned in their original world?",
                    "What final connection do they maintain with the strange world?"
                ]
            }
        ],
        description: 'A structure focused on world exploration, where the story begins with entry into a strange world and ends with departure or integration. Perfect for fantasy, science fiction, and travel narratives.',
        examples: "Alice in Wonderland, The Chronicles of Narnia, Gulliver's Travels",
        image: '/img/story-structures/milieu-driven.png',
        learnMoreUrl: '/learn/milieu-driven-structure',
        bestGenres: [
			"Fantasy",
			"Science Fiction",
			"Adventure",
			"Speculative Fiction",
			"Alternate History"
		],
		recommendedTones: [
			"Adventurous",
			"Mysterious",
			"Ambitious",
			"Philosophical",
			"Varied"
		],
		moreDescription: "Best when the world itself is the primary focus of the story",
        suggestedContentType: {
            name: "Both",
            reason: "Perfect for exploring imaginary worlds in fiction, but also great for travel writing or describing real places and cultures."
        }
    },

    // {
    //     id: 'nonlinear',
    //     title: 'Nonlinear',
    //     label: 'Nonlinear Structure',
    //     type: "Novel",
    //     chapterAmount: 12,
    //     chapters: [
    //         {
    //             title: "Present Moment Anchor",
    //             objective: "Establish a central timeline or event that serves as an anchor for the narrative",
    //             wordCount: "3000-4500",
    //             questionsToAnswer: [
    //                 "What present moment serves as your story's anchor?",
    //                 "What conflict or question is central to this timeline?",
    //                 "What mystery or intrigue pulls the reader in?"
    //             ]
    //         },
    //         {
    //             title: "First Timeline Shift",
    //             objective: "Introduce the first major shift to a different time period or perspective",
    //             wordCount: "3500-5000",
    //             questionsToAnswer: [
    //                 "What earlier or later moment will you jump to?",
    //                 "How does this shift provide context for the anchor timeline?",
    //                 "What narrative connectors link these two points?"
    //             ]
    //         },
    //         {
    //             title: "Connection Development",
    //             objective: "Develop the relationship between the different timelines or perspectives",
    //             wordCount: "3000-4500",
    //             questionsToAnswer: [
    //                 "What connections begin to emerge between timelines?",
    //                 "What objects, people, or themes appear in both?",
    //                 "What questions does this connection raise?"
    //             ]
    //         },
    //         {
    //             title: "Return to Anchor",
    //             objective: "Return to the main timeline with new context from the shift",
    //             wordCount: "3000-4500",
    //             questionsToAnswer: [
    //                 "How does returning to the anchor timeline feel different now?",
    //                 "What new understanding do readers have?",
    //                 "How has the anchor timeline advanced?"
    //             ]
    //         },
    //         {
    //             title: "Second Timeline Shift",
    //             objective: "Move to another time period or perspective that adds another layer",
    //             wordCount: "3500-5000",
    //             questionsToAnswer: [
    //                 "What different time period or perspective is revealed next?",
    //                 "What new information complicates the overall narrative?",
    //                 "How does this shift relate to both previous timelines?"
    //             ]
    //         },
    //         {
    //             title: "Pattern Emergence",
    //             objective: "Begin revealing the pattern or meaning behind the multiple timelines",
    //             wordCount: "4000-5500",
    //             questionsToAnswer: [
    //                 "What pattern starts to emerge across timelines?",
    //                 "What causes or consequences become apparent?",
    //                 "What theme is developed through these connections?"
    //             ]
    //         },
    //         {
    //             title: "Intersection Point",
    //             objective: "Present a moment where timelines or perspectives directly intersect",
    //             wordCount: "4000-6000",
    //             questionsToAnswer: [
    //                 "How do separate timelines or perspectives collide?",
    //                 "What revelations occur at this intersection?",
    //                 "How does this change the reader's understanding?"
    //             ]
    //         },
    //         {
    //             title: "Narrative Acceleration",
    //             objective: "Increase pace through rapid shifts between timelines as connections multiply",
    //             wordCount: "3500-5000",
    //             questionsToAnswer: [
    //                 "How can you accelerate between timelines?",
    //                 "What parallel moments or decisions occur?",
    //                 "How do events in different timelines mirror or contrast each other?"
    //             ]
    //         },
    //         {
    //             title: "Key Revelation",
    //             objective: "Reveal a crucial piece of information that recontextualizes previous chapters",
    //             wordCount: "3000-4500",
    //             questionsToAnswer: [
    //                 "What major revelation changes everything?",
    //                 "How does this force readers to reconsider earlier events?",
    //                 "What mysteries are suddenly clarified?"
    //             ]
    //         },
    //         {
    //             title: "Timeline Convergence",
    //             objective: "Begin bringing the separate threads toward a common point or understanding",
    //             wordCount: "4000-6000",
    //             questionsToAnswer: [
    //                 "How do the separate timelines begin to converge?",
    //                 "What common destination or truth emerges?",
    //                 "How do characters across timelines move toward similar realizations?"
    //             ]
    //         },
    //         {
    //             title: "Climactic Integration",
    //             objective: "Present the moment where all timelines or perspectives reach their culmination",
    //             wordCount: "4500-7000",
    //             questionsToAnswer: [
    //                 "How do all narratives threads reach their climax?",
    //                 "What final connections are made clear?",
    //                 "How is the central conflict addressed across all timelines?"
    //             ]
    //         },
    //         {
    //             title: "New Understanding",
    //             objective: "Show the new perspective gained from seeing the complete, interconnected narrative",
    //             wordCount: "3000-4500",
    //             questionsToAnswer: [
    //                 "What final understanding emerges from the full picture?",
    //                 "How has perspective shifted from beginning to end?",
    //                 "What ultimate truth or theme is revealed through the nonlinear format?"
    //             ]
    //         }
    //     ],
    //     description: 'A structure that moves back and forth in time or between different perspectives. Effective for stories that explore cause and effect, memory, or multiple viewpoints of the same events.',
    //     examples: 'Cloud Atlas, Slaughterhouse-Five, A Visit from the Goon Squad',
    //     image: '/img/story-structures/nonlinear.png',
    //     learnMoreUrl: '/learn/nonlinear-structure'
    // }
];

// Short Story Structures
const shortStoryStructures = [
    {
        id: 'freytags-pyramid-short',
        title: "Freytag's Pyramid",
        label: "Freytag's Pyramid",
        type: "Short Story",
        chapterAmount: 5,
        chapters: [
            {
                title: "Exposition",
                objective: "Introduce characters, setting, and the initial situation",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "Who are your characters?",
                    "What is the setting and atmosphere?",
                    "What is the current status quo before disruption?"
                ]
            },
            {
                title: "Rising Action",
                objective: "Develop complications and build tension toward the climax",
                wordCount: "1000-1500",
                questionsToAnswer: [
                    "What conflicts or complications arise?",
                    "How do the stakes increase?",
                    "What obstacles must the protagonist overcome?"
                ]
            },
            {
                title: "Climax",
                objective: "Present the turning point of maximum tension",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What is the moment of highest tension?",
                    "What critical decision or action occurs?",
                    "How does this moment change everything that follows?"
                ]
            },
            {
                title: "Falling Action",
                objective: "Show the immediate consequences of the climax",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What happens as a result of the climactic moment?",
                    "How do characters react to these events?",
                    "How do tensions begin to resolve?"
                ]
            },
            {
                title: "Denouement",
                objective: "Resolve loose ends and establish the new normal",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "How is the conflict ultimately resolved?",
                    "What is the new status quo?",
                    "What final insight or feeling should the reader be left with?"
                ]
            }
        ],
        description: 'A classical dramatic structure with five parts that form a pyramid shape when graphed. Ideal for short stories with a single, powerful arc and clear resolution.',
        examples: 'The Necklace, The Most Dangerous Game, Hills Like White Elephants',
        image: '/img/story-structures/freytag-pyramid.png',
        learnMoreUrl: '/learn/freytags-pyramid',
        bestGenres: [
			"Tragedy",
			"Drama",
			"Gothic",
			"Historical",
			"Literary Fiction"
		],
		recommendedTones: [
			"Tragic",
			"Dramatic",
			"Serious",
			"Somber",
			"Formal"
		],
		moreDescription: "Classical dramatic structure with emphasis on rising and falling action",
        suggestedContentType: {
            name: "Fiction",
            reason: "Created specifically for dramatic plays and stories with rising action and climax, which is hard to guarantee in real-life events."
        }
    },

    {
        id: 'kishotenketsu',
        title: 'Kishōtenketsu',
        label: 'Kishōtenketsu',
        type: "Short Story",
        chapterAmount: 4,
        chapters: [
            {
                title: "Ki (Introduction)",
                objective: "Establish the characters, setting, and normal situation",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "Who are your main characters?",
                    "What is their normal environment or situation?",
                    "What everyday scene can you use to introduce them?"
                ]
            },
            {
                title: "Shō (Development)",
                objective: "Develop the initial situation further without major change",
                wordCount: "750-1250",
                questionsToAnswer: [
                    "How can you deepen understanding of the established elements?",
                    "What additional details or situations reveal more about the characters?",
                    "What subtle tensions or questions might emerge?"
                ]
            },
            {
                title: "Ten (Twist)",
                objective: "Introduce an unexpected element, perspective shift, or complication",
                wordCount: "750-1250",
                questionsToAnswer: [
                    "What unexpected element can you introduce?",
                    "How does this create a new perspective on what came before?",
                    "What seemingly unrelated element will actually connect meaningfully?"
                ]
            },
            {
                title: "Ketsu (Conclusion)",
                objective: "Bring elements together in a meaningful resolution that doesn't necessarily solve a conflict",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "How do all elements reconcile or connect?",
                    "What insight or harmony emerges from the seeming contradiction?",
                    "What final image or scene provides closure without necessarily solving a problem?"
                ]
            }
        ],
        description: 'A four-part East Asian narrative structure that focuses on contrast and revelation rather than conflict and resolution. Perfect for stories that reveal a new perspective.',
        examples: 'Many traditional Japanese stories, certain works by Haruki Murakami, "Sudden Fiction"',
        image: '/img/story-structures/kishotenketsu.png',
        learnMoreUrl: '/learn/kishotenketsu-structure',
		bestGenres: [
			"Literary Fiction",
			"Realistic Fiction",
			"Philosophical",
			"Comedy",
			"Experimental"
		],
		recommendedTones: [
			"Reflective",
			"Philosophical",
			"Whimsical",
			"Lyrical",
			"Nostalgic"
		],
		moreDescription: "Ideal for subtle character development without traditional conflict",
        suggestedContentType: {
            name: "Both", 
            reason: "This gentle structure without conflict works for both fictional slice-of-life stories and real-life personal essays or observations."
        }
    },
    {
        id: 'in-medias-res',
        title: 'In Medias Res',
        label: 'In Medias Res',
        type: "Short Story",
        chapterAmount: 3,
        chapters: [
            {
                title: "The Critical Moment",
                objective: "Begin at a crucial point of conflict or action, midway through the larger story",
                wordCount: "750-1500",
                questionsToAnswer: [
                    "What compelling moment of tension or action will hook readers?",
                    "What urgent questions will this opening raise?",
                    "What essential context can be woven in without slowing momentum?"
                ]
            },
            {
                title: "Background and Context",
                objective: "Reveal key information about how the characters arrived at this point",
                wordCount: "1000-2000",
                questionsToAnswer: [
                    "What crucial past events led to the opening situation?",
                    "What character motivations need clarification?",
                    "How can you balance backstory with maintaining forward momentum?"
                ]
            },
            {
                title: "Resolution and Aftermath",
                objective: "Bring the immediate conflict to a conclusion and show its consequences",
                wordCount: "750-1500",
                questionsToAnswer: [
                    "How is the central conflict resolved?",
                    "What realization or change occurs?",
                    "How does the story's end connect to its dramatic beginning?"
                ]
            }
        ],
        description: 'A structure that begins in the middle of the action and provides context through backstory. Perfect for short stories with a dramatic hook and compelling backstory.',
        examples: 'The Old Man and the Sea, Slaughterhouse-Five, "A Good Man is Hard to Find"',
        image: '/img/story-structures/in-medias-res.png',
        learnMoreUrl: '/learn/in-medias-res'
    },

    {
        id: 'seven-point-short',
        title: 'Seven-Point',
        label: 'Seven-Point Structure (Condensed)',
        type: "Short Story",
        chapterAmount: 7,
        chapters: [
            {
                title: "Hook",
                objective: "Establish the protagonist and the initial situation",
                wordCount: "500-800",
                questionsToAnswer: [
                    "Who is your protagonist?",
                    "What makes them interesting or relatable?",
                    "What is their normal situation before disruption?"
                ]
            },
            {
                title: "Plot Turn 1",
                objective: "Introduce the inciting incident that sets the main conflict in motion",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What event forces your protagonist out of their comfort zone?",
                    "What problem must they now address?",
                    "What goal emerges from this situation?"
                ]
            },
            {
                title: "Pinch Point 1",
                objective: "Show the first major pressure point or obstacle",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What first major challenge appears?",
                    "How does the antagonistic force reveal its power?",
                    "How does this raise the stakes for the protagonist?"
                ]
            },
            {
                title: "Midpoint",
                objective: "Present a pivotal moment that shifts the protagonist from reactive to proactive",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What revelation or event changes the protagonist's understanding?",
                    "How does their approach or goal change?",
                    "How do they shift from reacting to taking charge?"
                ]
            },
            {
                title: "Pinch Point 2",
                objective: "Deliver a stronger blow that forces the protagonist to fully commit",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What major setback or crisis occurs?",
                    "What is lost or at risk?",
                    "How does this push the protagonist to go all-in?"
                ]
            },
            {
                title: "Plot Turn 2",
                objective: "Show the protagonist gaining what they need for the final confrontation",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What key insight or tool does the protagonist acquire?",
                    "How does this prepare them for the resolution?",
                    "What plan or approach do they develop?"
                ]
            },
            {
                title: "Resolution",
                objective: "Present the final confrontation and its aftermath",
                wordCount: "750-1200",
                questionsToAnswer: [
                    "How is the main conflict ultimately addressed?",
                    "How has the protagonist changed?",
                    "What new equilibrium is established?"
                ]
            }
        ],
        description: 'A condensed version of the seven-point structure with clearly defined story beats. Great for short stories with clear cause-and-effect progression.',
        examples: "The Tell-Tale Heart, The Lady or the Tiger, The Monkey's Paw",
        image: '/img/story-structures/seven-point.png',
        learnMoreUrl: '/learn/seven-point-structure',
        bestGenres: [
			"Fantasy",
			"Science Fiction",
			"Mystery",
			"Adventure",
			"Young Adult"
		],
		recommendedTones: [
			"Adventurous",
			"Dramatic",
			"Exciting",
			"Heroic",
			"Confident"
		],
		moreDescription: "Provides detailed scaffolding for complex plots and character development",
        suggestedContentType: {
            name: "Both",
            reason: "The detailed plot points help organize complex fictional adventures, but also work for structuring how-to guides, case studies, or educational content."
        }
    },

    {
        id: 'single-effect',
        title: 'Single-Effect',
        label: 'Single Effect',
        type: "Short Story",
        chapterAmount: 3,
        chapters: [
            {
                title: "Introduction",
                objective: "Set up the premise and atmosphere that will lead to the singular emotional effect",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What mood or tone must be established from the beginning?",
                    "What situation will lead toward your intended emotional impact?",
                    "What details or imagery will contribute to the single effect?"
                ]
            },
            {
                title: "Development",
                objective: "Build tension and deepen the elements that contribute to the single effect",
                wordCount: "1000-2000",
                questionsToAnswer: [
                    "How can every scene intensify the central mood or theme?",
                    "What complications enhance the intended effect?",
                    "How can you remove anything that doesn't contribute to the single effect?"
                ]
            },
            {
                title: "Culmination",
                objective: "Deliver the powerful emotional climax that the entire story has been building toward",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What final moment delivers the maximum emotional impact?",
                    "How does everything in the story coalesce in this moment?",
                    "What lasting impression do you want readers to take away?"
                ]
            }
        ],
        description: 'A structure focused on creating one powerful emotional effect or impression. Excellent for horror, emotional pieces, or stories with a powerful twist.',
        examples: `Works by Edgar Allan Poe, O. Henry's twist endings, "The Yellow Wallpaper"`,
        image: '/img/story-structures/single-effect.png',
        learnMoreUrl: '/learn/single-effect-structure',
        bestGenres: [
			"Short Story",
			"Psychological Thriller",
			"Ghost Story",
			"Mystery",
			"Poetry"
		],
		recommendedTones: [
			"Suspenseful",
			"Mysterious",
			"Tense",
			"Dark",
			"Dramatic"
		],
		moreDescription: "Designed for concentrated, impactful storytelling with singular focus",
        suggestedContentType: {
            name: "Both",
            reason: "Can create one powerful impact in both made-up stories (like a scary tale) and true stories (like a memorable personal experience)."
        }
    },

    {
        id: 'five-act-short',
        title: 'Five-Act',
        label: 'Five-Act Structure (Condensed)',
        type: "Short Story",
        chapterAmount: 5,
        chapters: [
            {
                title: "Exposition",
                objective: "Introduce characters, setting, and the initial situation",
                wordCount: "500-800",
                questionsToAnswer: [
                    "Who are your main characters?",
                    "What is the setting and atmosphere?",
                    "What potential conflicts are brewing beneath the surface?"
                ]
            },
            {
                title: "Rising Action",
                objective: "Develop complications that intensify the central conflict",
                wordCount: "750-1200",
                questionsToAnswer: [
                    "What inciting incident sets events in motion?",
                    "What obstacles or complications emerge?",
                    "How do tensions and stakes escalate?"
                ]
            },
            {
                title: "Climax",
                objective: "Present the turning point of maximum tension",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What is the moment of highest tension or conflict?",
                    "What critical decision or action changes everything?",
                    "What's the point of no return for your characters?"
                ]
            },
            {
                title: "Falling Action",
                objective: "Show the immediate consequences of the climactic moment",
                wordCount: "500-800",
                questionsToAnswer: [
                    "What happens as a result of the climax?",
                    "How do characters respond to the changed situation?",
                    "What loose ends begin to be tied up?"
                ]
            },
            {
                title: "Denouement",
                objective: "Resolve the story and establish the new normal",
                wordCount: "500-800",
                questionsToAnswer: [
                    "How is the central conflict finally resolved?",
                    "What new understanding or equilibrium is reached?",
                    "What final image or scene provides closure?"
                ]
            }
        ],
        description: 'A condensed version of the classical five-part dramatic structure. Well-suited for short stories with a traditional arc and clear resolution.',
        examples: 'The Cask of Amontillado, The Story of an Hour, A Rose for Emily',
        image: '/img/story-structures/five-act.png',
        learnMoreUrl: '/learn/five-act-structure',
        bestGenres: [
			"Historical",
			"Literary Fiction",
			"Political Thriller",
			"Biographical",
			"War"
		],
		recommendedTones: [
			"Formal",
			"Serious",
			"Dramatic",
			"Authoritative",
			"Tragic"
		],
		moreDescription: "Allows for extended development and complex character exploration",
        suggestedContentType: {
            name: "Both",
            reason: "The extended dramatic arc suits complex fictional plots but also works well for detailed biographies, historical accounts, or business stories."
        }
    },


    {
        id: 'heros-journey-short',
        title: "Hero's Journey",
        label: "Hero's Journey (Condensed)",
        type: "Short Story",
        chapterAmount: 7,
        chapters: [
            {
                title: "Ordinary World",
                objective: "Establish the hero's normal life and limitations",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What is your hero's everyday life like?",
                    "What limitations or problems do they face?",
                    "What unspoken desire do they have?"
                ]
            },
            {
                title: "Call to Adventure & Refusal",
                objective: "Present the inciting incident and initial resistance",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What disrupts the hero's normal life?",
                    "Why does the hero hesitate to act?",
                    "What convinces them to move forward?"
                ]
            },
            {
                title: "Crossing the Threshold",
                objective: "Show the hero's commitment to the journey and entry into the unknown",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "How does the hero leave their comfort zone?",
                    "What represents the point of no return?",
                    "What early challenges do they face?"
                ]
            },
            {
                title: "Tests & Allies",
                objective: "Present challenges and relationships that prepare the hero",
                wordCount: "1000-1500",
                questionsToAnswer: [
                    "What obstacles must the hero overcome?",
                    "Who helps or hinders them?",
                    "What lessons or tools do they acquire?"
                ]
            },
            {
                title: "The Ordeal",
                objective: "Show the hero facing their greatest fear or challenge",
                wordCount: "750-1200",
                questionsToAnswer: [
                    "What is the hero's darkest moment?",
                    "What fear or weakness must they confront?",
                    "What is at stake in this critical test?"
                ]
            },
            {
                title: "Reward & Return Journey",
                objective: "Present what the hero gains and their path back",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "What does the hero gain from their ordeal?",
                    "What new opposition emerges on the return?",
                    "How do they apply what they've learned?"
                ]
            },
            {
                title: "Return with the Elixir",
                objective: "Show the hero's return and the benefit they bring",
                wordCount: "500-1000",
                questionsToAnswer: [
                    "How has the hero been transformed?",
                    "What gift or wisdom do they bring back?",
                    "How does this benefit their world or community?"
                ]
            }
        ],
        description: "A condensed version of Joseph Campbell's monomyth structure, focused on the key stages.Excellent for short adventure stories with transformative character journeys.",
        examples: "The Emperor's New Clothes, The Devil and Tom Walker, The Ugly Duckling",
        image: '/img/story-structures/hero-journey2.png',
        learnMoreUrl: '/learn/heros-journey',
        bestGenres: [
			"Fantasy",
			"Adventure",
			"Science Fiction",
			"Mythology",
			"Coming-of-Age"
		],
		recommendedTones: [
			"Heroic",
			"Inspirational",
			"Adventurous",
			"Dramatic",
			"Uplifting"
		],
		moreDescription: "Perfect for epic quests and character transformation stories",
        suggestedContentType: {
            name: "Fiction",
            reason: "Focuses on a character's personal transformation through challenges, which works best with imaginary heroes and adventures."
        }
    },


    {
        id: 'three-act-short',
        title: 'Three-Act',
        label: 'Three-Act Structure',
        type: "Short Story",
        chapterAmount: 3,
        chapters: [
            {
                title: "Setup",
                objective: "Establish the protagonist, their world, and the inciting incident",
                wordCount: "750-1500",
                questionsToAnswer: [
                    "Who is your protagonist and what do they want?",
                    "What is their normal world like?",
                    "What incident disrupts their status quo?"
                ]
            },
            {
                title: "Confrontation",
                objective: "Develop the conflict through escalating complications",
                wordCount: "1500-3000",
                questionsToAnswer: [
                    "What obstacles stand in the protagonist's way?",
                    "How do the stakes escalate?",
                    "What is the moment of greatest tension or difficulty?"
                ]
            },
            {
                title: "Resolution",
                objective: "Bring the conflict to a climax and show the aftermath",
                wordCount: "750-1500",
                questionsToAnswer: [
                    "How is the central conflict resolved?",
                    "How has the protagonist changed?",
                    "What is the new status quo?"
                ]
            }
        ],
        description: 'A condensed version of the classic three-act structure, perfect for creating a complete and satisfying short story with clear beginning, middle, and end.',
        examples: 'The Gift of the Magi, The Lottery, Most short stories by Edgar Allan Poe',
        image: '/img/story-structures/three-act2.png',
        learnMoreUrl: '/learn/three-act-structure',
        bestGenres: [
			"Drama",
			"Crime",
			"Romance",
			"Thriller",
			"War"
		],
		recommendedTones: [
			"Dramatic",
			"Serious",
			"Resolute",
			"Authoritative",
			"Varied"
		],
		moreDescription: "The versatile workhorse structure that fits most mainstream genres",
        suggestedContentType: {
            name: "Both",
            reason: "The setup-conflict-resolution pattern works for fictional stories and true stories like business cases, historical events, or personal journeys."
        }
    },


    // {
    //     id: 'experimental',
    //     title: 'Experimental',
    //     label: 'Experimental Structure',
    //     type: "Short Story",
    //     chapterAmount: 5,
    //     chapters: [
    //         {
    //             title: "Foundation Element",
    //             objective: "Establish the core concept, image, or motif that will anchor the experimental approach",
    //             wordCount: "500-1000",
    //             questionsToAnswer: [
    //                 "What central image, concept, or pattern will serve as your foundation?",
    //                 "What rules or constraints will shape your experimental approach?",
    //                 "What emotional or intellectual effect do you want to create?"
    //             ]
    //         },
    //         {
    //             title: "Variation One",
    //             objective: "Present the first iteration or exploration of your central element",
    //             wordCount: "750-1250",
    //             questionsToAnswer: [
    //                 "How can you explore your foundation element from a first perspective?",
    //                 "What technique (fragmentation, stream of consciousness, etc.) will you employ?",
    //                 "What unexpected connections can you create?"
    //             ]
    //         },
    //         {
    //             title: "Variation Two",
    //             objective: "Offer a contrasting or evolving exploration of your central element",
    //             wordCount: "750-1250",
    //             questionsToAnswer: [
    //                 "How can you transform or recontextualize your foundation element?",
    //                 "What contradictions or complexities can you introduce?",
    //                 "How can form and content intertwine meaningfully?"
    //             ]
    //         },
    //         {
    //             title: "Variation Three",
    //             objective: "Provide a third perspective or transformation of your central element",
    //             wordCount: "750-1250",
    //             questionsToAnswer: [
    //                 "What third angle or approach reveals something new about your foundation?",
    //                 "How can you subvert reader expectations established in earlier sections?",
    //                 "What deeper layer of meaning emerges through this iteration?"
    //             ]
    //         },
    //         {
    //             title: "Integration or Fracture",
    //             objective: "Either bring elements together in an unexpected synthesis or deliberately leave them fragmented",
    //             wordCount: "500-1000",
    //             questionsToAnswer: [
    //                 "Should your elements converge or remain deliberately separate?",
    //                 "What final impression or question do you want to leave with readers?",
    //                 "How does your structural choice reflect the story's themes?"
    //             ]
    //         }
    //     ],
    //     description: 'A flexible structure that breaks from conventional narrative patterns. Ideal for stories that challenge reader expectations or explore concepts through form as well as content.',
    //     examples: `Works by Jorge Luis Borges, Italo Calvino's "Invisible Cities", "If on a winter's night a traveler"`,
    //     image: '/img/story-structures/experimental.png',
    //     learnMoreUrl: '/learn/experimental-structure'
    // }
];



const allStructures = [
    {
        title: 'Three-Act Structure',
        chapterAmount: 12,
        description: 'A classic beginning, middle, and end structure divided into setup, confrontation, and resolution. Perfect for traditional storytelling with clear dramatic arcs.',
		moreDescription: "The versatile workhorse structure that fits most mainstream genres",
    },
    {
        title: "Hero's Journey",
        chapterAmount: 12,
        description: 'A classic beginning, middle, and end structure divided into setup, confrontation, and resolution. Perfect for traditional storytelling with clear dramatic arcs.',
		moreDescription: "The versatile workhorse structure that fits most mainstream genres",
    },

]

// Export both arrays
export { novelStructures, shortStoryStructures };