export interface SceneInterface {
    title: string,
    description: string,
    order: string,
    setting: string,
    charactersInvolved: CharactersInvolved[]
}

interface CharactersInvolved {
    name: string,
    roleInScene: string;
    relationshipToProtagonist: string;
}