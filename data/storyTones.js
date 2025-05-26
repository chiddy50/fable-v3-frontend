export const storyTones = [
    "Optimistic",
    "Pessimistic",
    "Serious",
    "Humorous",
    "Formal",
    "Informal",
    "Lighthearted",
    "Dark",
    "Inspirational",
    "Motivational",
    "Cautious",
    "Confident",
    "Mysterious",
    "Suspenseful",
    "Melancholic",
    "Romantic",
    "Dramatic",
    "Adventurous",
    "Tense",
    "Playful",
    "Empathetic",
    "Sarcastic",
    "Critical",
    "Sincere",
    "Nostalgic",
    "Philosophical",
    "Hopeful",
    "Tragic",
    "Heroic",
    "Whimsical",
    "Ambitious",
    "Reflective",
    "Gritty",
    "Courageous",
    "Cynical",
    "Uplifting",
    "Somber",
    "Exciting",
    "Aggressive",
    "Persuasive",
    "Objective",
    "Sentimental",
    "Moralistic",
    "Satirical",
    "Resolute",
    "Sympathetic",
    "Authoritative",
    "Neutral",

    "Unconventional",
    "Lyrical",
    "Varied",
    

];


export let tones = storyTones.map((tone, index) => {
    return { value: tone.toLocaleLowerCase(), label: tone }
}).sort((a, b) => {
    if (a.value < b.value) {
        return -1;
    }
    if (a.value > b.value) {
        return 1;
    }
    return 0;
});