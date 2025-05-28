"use client"

import { useState, useCallback, useRef, useEffect } from 'react';
import { Save, Edit3, Play, Bookmark, Check, X, Loader2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { StoryInterface } from '@/interfaces/StoryInterface';
import { SynopsisCharacterInterface } from '@/interfaces/SynopsisInterface';


interface Props {
    characters: SynopsisCharacterInterface[];
    story: StoryInterface;
    openCharacterSuggestionsModal: boolean;
    setOpenCharacterSuggestionsModal: React.Dispatch<React.SetStateAction<boolean>>;
    onCharactersUpdate: () => void;
}

const EditableCharacterManager: React.FC<Props> = ({
    characters,
    onCharactersUpdate,
    story,
    setOpenCharacterSuggestionsModal,
    openCharacterSuggestionsModal
}) => {
    const [editingCharacter, setEditingCharacter] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [localCharacters, setLocalCharacters] = useState(characters);

    // Ref to maintain scroll position
    const sheetContentRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef<number>(0);

    // Update local characters when prop changes but preserve scroll position
    useEffect(() => {
        if (!editingCharacter) {
            setLocalCharacters(characters);
        }
    }, [characters, editingCharacter]);

    // Preserve scroll position during edits
    useEffect(() => {
        if (sheetContentRef.current && editingCharacter) {
            // Restore scroll position after state updates
            const timer = setTimeout(() => {
                if (sheetContentRef.current) {
                    sheetContentRef.current.scrollTop = scrollPositionRef.current;
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [localCharacters, editingCharacter]);

    // API endpoint functions
    const useCharacterEndpoint = async (character: SynopsisCharacterInterface) => {
        const endpoint = '/api/characters/use';
        const payload = {
            characterId: character.id,
            character: character,
            timestamp: new Date().toISOString()
        };

        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}/synopsis-character`;
            // let res = await axiosInterceptorInstance.put(url, payload);

            // const response = await fetch(endpoint, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('authToken')}` // If auth is needed
            //     },
            //     body: JSON.stringify(payload)
            // });


            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const result = await response.json();
            // return result;
        } catch (error) {
            console.error('Error using character:', error);
            throw error;
        }
    };

    const saveForLaterEndpoint = async (character: SynopsisCharacterInterface) => {
        const endpoint = '/api/characters/save-for-later';
        const payload = {
            characterId: character.id,
            character: character,
            savedAt: new Date().toISOString()
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving character for later:', error);
            throw error;
        }
    };

    const updateCharacterEndpoint = async (character: SynopsisCharacterInterface) => {
        const endpoint = `/api/characters/${character.id}`;
        const payload = {
            ...character,
            updatedAt: new Date().toISOString()
        };

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error updating character:', error);
            throw error;
        }
    };

    // Handler functions
    const handleUseCharacter = async (character: SynopsisCharacterInterface) => {
        const loadingKey = `use-${character.id}`;
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await useCharacterEndpoint(character);
            toast.success(`Successfully added ${character.name} to your story!`);
        } catch (error: any) {
            toast.error(`Failed to use character: ${error?.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const handleSaveForLater = async (character: SynopsisCharacterInterface) => {
        const loadingKey = `save-${character.id}`;
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await saveForLaterEndpoint(character);
            alert(`${character.name} saved for later use!`);
        } catch (error: any) {
            alert(`Failed to save character: ${error.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const handleSaveChanges = async (character: SynopsisCharacterInterface) => {
        const loadingKey = `update-${character.id}`;
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

        try {
            await updateCharacterEndpoint(character);
            setEditingCharacter(null);
            // Update parent component if callback provided
            if (onCharactersUpdate) {
                onCharactersUpdate(localCharacters);
            }
            alert(`${character.name} updated successfully!`);
        } catch (error: any) {
            alert(`Failed to update character: ${error.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        }
    };

    const startEditing = (characterId: string) => {
        // Save current scroll position before editing
        if (sheetContentRef.current) {
            scrollPositionRef.current = sheetContentRef.current.scrollTop;
        }
        setEditingCharacter(characterId);
    };

    const cancelEditing = () => {
        // Reset to original data
        setLocalCharacters(characters);
        setEditingCharacter(null);
    };

    const updateCharacterField = useCallback((characterId: string, field: string, value: any) => {
        // Save current scroll position before updating
        if (sheetContentRef.current) {
            scrollPositionRef.current = sheetContentRef.current.scrollTop;
        }

        setLocalCharacters(prev =>
            prev.map(char =>
                char.id === characterId
                    ? { ...char, [field]: value }
                    : char
            )
        );
    }, []);

    const getCurrentCharacter = (characterId: string) => {
        return localCharacters.find(char => char.id === characterId);
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            protagonist: 'bg-blue-100 text-blue-800 border-blue-200',
            antagonist: 'bg-red-100 text-red-800 border-red-200',
            mentor: 'bg-green-100 text-green-800 border-green-200',
            sidekick: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            neutral: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[role] || colors.neutral;
    };

    const EditableField = ({
        label,
        value,
        onChange,
        type = 'text',
        multiline = false,
        options = null
    }: {
        label: string;
        value: any;
        onChange: (value: any) => void;
        type?: string;
        multiline?: boolean;
        options?: string[] | null;
    }) => {
        const handleChange = useCallback((newValue: any) => {
            // Prevent unnecessary re-renders by only calling onChange if value actually changed
            if (newValue !== value) {
                onChange(newValue);
            }
        }, [value, onChange]);

        if (options) {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 text-xs rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            );
        }

        if (multiline) {
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <textarea
                        value={value || ''}
                        onChange={(e) => handleChange(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            );
        }

        return (
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-full px-3 py-2 border text-xs border-gray-300 rounded-md focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        );
    };

    const CharacterCard = ({ character }: { character: SynopsisCharacterInterface }) => {
        const isEditing = editingCharacter === character.id;
        const currentCharacter = getCurrentCharacter(character.id);

        if (!currentCharacter) return null;

        return (
            <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <EditableField
                                        label="Name"
                                        value={currentCharacter.name}
                                        onChange={(value) => updateCharacterField(character.id, 'name', value)}
                                    />
                                    <EditableField
                                        label="Alias"
                                        value={currentCharacter.alias}
                                        onChange={(value) => updateCharacterField(character.id, 'alias', value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditableField
                                            label="Gender"
                                            value={currentCharacter.gender}
                                            onChange={(value) => updateCharacterField(character.id, 'gender', value)}
                                            options={['Male', 'Female', 'Non-binary', 'Other']}
                                        />
                                        <EditableField
                                            label="Age"
                                            value={currentCharacter.age}
                                            onChange={(value) => updateCharacterField(character.id, 'age', value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <EditableField
                                            label="Role"
                                            value={currentCharacter.role}
                                            onChange={(value) => updateCharacterField(character.id, 'role', value)}
                                            options={['protagonist', 'antagonist', 'mentor', 'sidekick', 'neutral']}
                                        />
                                        <EditableField
                                            label="Race"
                                            value={currentCharacter.race}
                                            onChange={(value) => updateCharacterField(character.id, 'race', value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
                                    </div>
                                    <p className="text-gray-600 text-[11px] italic mb-3">"{character.alias}"</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[11px] font-medium border ${getRoleColor(character.role)}`}>
                                            {character.role}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {character.race} • {character.age} • {character.gender}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => handleSaveChanges(currentCharacter)}
                                        disabled={loadingStates[`update-${character.id}`]}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                        title="Save changes"
                                    >
                                        {loadingStates[`update-${character.id}`] ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Cancel editing"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => startEditing(character.id)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit character"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <EditableField
                                label="Backstory"
                                value={currentCharacter.backstory}
                                onChange={(value) => updateCharacterField(character.id, 'backstory', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Internal Conflict"
                                value={currentCharacter.internalConflict}
                                onChange={(value) => updateCharacterField(character.id, 'internalConflict', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="External Conflict"
                                value={currentCharacter.externalConflict}
                                onChange={(value) => updateCharacterField(character.id, 'externalConflict', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Relationship to Protagonists"
                                value={currentCharacter.relationshipToProtagonists}
                                onChange={(value) => updateCharacterField(character.id, 'relationshipToProtagonists', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Weaknesses"
                                value={currentCharacter.weaknesses}
                                onChange={(value) => updateCharacterField(character.id, 'weaknesses', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Strengths"
                                value={currentCharacter.strengths}
                                onChange={(value) => updateCharacterField(character.id, 'strengths', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Voice"
                                value={currentCharacter.voice}
                                onChange={(value) => updateCharacterField(character.id, 'voice', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Perspective"
                                value={currentCharacter.perspective}
                                onChange={(value) => updateCharacterField(character.id, 'perspective', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Role Justification"
                                value={currentCharacter.roleJustification}
                                onChange={(value) => updateCharacterField(character.id, 'roleJustification', value)}
                                multiline={true}
                            />
                            <EditableField
                                label="Unique Hook"
                                value={currentCharacter.uniqueHook}
                                onChange={(value) => updateCharacterField(character.id, 'uniqueHook', value)}
                                multiline={true}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Backstory</h4>
                                <p className="text-[11px] text-gray-600">{character.backstory}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Internal Conflict</h4>
                                    <p className="text-[11px] text-gray-600">{character.internalConflict}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">External Conflict</h4>
                                    <p className="text-[11px] text-gray-600">{character.externalConflict}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Relationship to Protagonists</h4>
                                <p className="text-[11px] text-gray-600">{character.relationshipToProtagonists}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Strengths</h4>
                                    <p className="text-[11px] text-gray-600">{character.strengths}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Weaknesses</h4>
                                    <p className="text-[11px] text-gray-600">{character.weaknesses}</p>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Voice</h4>
                                    <p className="text-[11px] text-gray-600">{character.voice}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Perspective</h4>
                                    <p className="text-[11px] text-gray-600">{character.perspective}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Unique Hook</h4>
                                <p className="text-[11px] text-gray-600">{character.uniqueHook}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleUseCharacter(character)}
                            disabled={loadingStates[`use-${character.id}`] || isEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingStates[`use-${character.id}`] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4" />
                            )}
                            Use Character
                        </button>

                        <button
                            onClick={() => handleSaveForLater(character)}
                            disabled={loadingStates[`save-${character.id}`] || isEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingStates[`save-${character.id}`] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Bookmark className="w-4 h-4" />
                            )}
                            Save for Later
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Sheet open={openCharacterSuggestionsModal} onOpenChange={setOpenCharacterSuggestionsModal}>
            <SheetContent
                ref={sheetContentRef}
                className="overflow-y-scroll xs:min-w-[90%] sm:min-w-[96%] md:min-w-[65%] lg:min-w-[65%] xl:min-w-[50%]"
            >
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>

                <div className="bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Character Manager</h1>
                            <p className="text-gray-600 text-xs">Edit your characters and manage them for your story</p>
                        </div>

                        <div className="space-y-6">
                            {localCharacters.map(character => (
                                <CharacterCard key={character.id} character={character} />
                            ))}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EditableCharacterManager;