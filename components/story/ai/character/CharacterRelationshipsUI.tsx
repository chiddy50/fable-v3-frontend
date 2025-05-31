"use client";

import React, { useState } from 'react';
import { Plus, X, Users, Edit3, Check, AlertCircle, XCircle } from 'lucide-react';
import { StoryInterface } from '@/interfaces/StoryInterface';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { SynopsisCharacterInterface, SynopsisInterface } from '@/interfaces/SynopsisInterface';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface Props {
    relationshipToOtherCharacters: any[];
    setRelationshipToOtherCharacters: React.Dispatch<React.SetStateAction<any[]>>;  
    currentCharacter: any;
    allAvailableCharacters: any[];
    story: StoryInterface;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
    setCharacters: React.Dispatch<React.SetStateAction<SynopsisCharacterInterface[]>>;
    activeSynopsis: SynopsisInterface;
}

const CharacterRelationshipsUI: React.FC<Props> = ({
    currentCharacter,
    relationshipToOtherCharacters,
    setRelationshipToOtherCharacters,
    allAvailableCharacters,
    story,
    activeSynopsis,
    setCharacters,
    setStory
}) => {
    // UI state
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [newRelationship, setNewRelationship] = useState({
        characterId: "",
        relationship: ""
    });
    const [editRelationship, setEditRelationship] = useState("");
    const [originalEditRelationship, setOriginalEditRelationship] = useState("");
    const [hasChanges, setHasChanges] = useState(false);
    const [relationshipToBeRemovedId, setRelationshipToBeRemovedId] = useState("");
    const [relationshipToCurrentCharacter, setRelationshipToCurrentCharacter] = useState<null|{ name: string, id: string, relationship: string}>(null);
    const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState("");



    // Get characters not yet in relationships
    const getAvailableCharacters = () => {
        // The publicId on the character model refers to the id on the relationship object
        // const usedIds = relationshipToOtherCharacters.map(rel => rel.id);
        // return allAvailableCharacters.filter(char => !usedIds.includes(char.id));

        const usedIds = relationshipToOtherCharacters.map(rel => rel.id);
        return allAvailableCharacters.filter(char => 
            !usedIds.includes(char.public_id) && !usedIds.includes(char.id)  
        );
    };

    // Add new relationship
    const handleAddRelationship = async () => {
        if (!newRelationship.characterId || !newRelationship.relationship.trim()) {
            return;
        }

        const selectedChar = allAvailableCharacters.find(char => char.public_id === newRelationship.characterId);
        if (!selectedChar) return;
        
        const newRelationshipData = {
            id: selectedChar.public_id,
            name: selectedChar.name,
            relationship: newRelationship.relationship.trim()
        };

        
        let characterRelationships = currentCharacter.relationshipToOtherCharacters && currentCharacter.relationshipToOtherCharacters.length > 0 ? [...currentCharacter.relationshipToOtherCharacters] : []
        characterRelationships.push(newRelationshipData);
       
        // console.log({allAvailableCharacters, selectedChar, newRelationship, characterRelationships})
        // return

        // SAVE NEW RELATIONSHIP TO DATABASE
        let payload = {
            characterId: currentCharacter.id,
            characterPublicId: currentCharacter.public_id,
            synopsisId: activeSynopsis?.id,
            storyId: story?.id,
            relationshipToOtherCharacters: characterRelationships
        }

        try {            
            showPageLoader();

            // CHANGE ENDPOINT TO SAVE CHARACTER RELATIONSHIP
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/synopses/${currentCharacter.id}/update-character-relationship`;
            let res = await axiosInterceptorInstance.put(url, payload);
            console.log(res);

            setCharacters(res?.data?.characters);
            
            // ADD RELATIONSHIP TO UI
            setRelationshipToOtherCharacters(prev => [...prev, newRelationshipData]);
            setNewRelationship({ characterId: "", relationship: "" });
            setIsAddingNew(false);
            // setHasChanges(true);
            
        } catch (error) {
            console.error(error);            
        } finally {
            hidePageLoader();
        }
    };

    // Remove relationship
    const handleRemoveRelationship = (id) => {
        if (!id) {
            return;
        }
        setRelationshipToBeRemovedId(id)
        // setRelationshipToOtherCharacters(prev => prev.filter(rel => rel.id !== id));
        setHasChanges(true);
    };

    // Start editing relationship
    const startEditing = (id: string, currentRelationship) => {
        if(!id) return;

        setEditingId(id);
        setEditRelationship(currentRelationship);
        setOriginalEditRelationship(currentRelationship);
    };

    // Save edited relationship
    const saveEdit = (id) => {
        if (!editRelationship.trim()) return;

        setRelationshipToOtherCharacters(prev =>
            prev.map(rel =>
                rel.id === id ? { ...rel, relationship: editRelationship.trim() } : rel
            )
        );
        setEditingId(null);
        setEditRelationship("");
        setOriginalEditRelationship("");
        setHasChanges(true);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditRelationship("");
        setOriginalEditRelationship("");
    };

    // Cancel all changes
    const handleCancelChanges = () => {
        // Reset any pending edits
        // setEditingId(null);
        // setEditRelationship("");
        // setOriginalEditRelationship("");
        // setIsAddingNew(false);
        // setNewRelationship({ characterId: "", relationship: "" });

        setHasChanges(false);
        // Note: This would ideally reset relationshipToOtherCharacters to its original state
        // You might want to store the original state in a ref or parent component
    };

    // Save all changes
    const handleSaveChanges = async () => {
        try {
            setRelationshipToOtherCharacters(prev => prev.filter(rel => rel.id !== relationshipToBeRemovedId));

            console.log("Saving relationships:", relationshipToOtherCharacters);

            let payload = {
                characterId: currentCharacter.id,
                relationshipToOtherCharacters,
                synopsisId: activeSynopsis?.id,
                storyId: story?.id
            }
            console.log(payload);
            // return;

            try {            
                showPageLoader();

                // CHANGE ENDPOINT TO SAVE CHARACTER RELATIONSHIP

                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/synopses/${currentCharacter.id}/update-character`;
                let res = await axiosInterceptorInstance.put(url, payload);
                console.log(res);
                // setStory(res?.data?.story);
                setCharacters(res?.data?.characters);
                // FINALLY REMOVE FROM RELATIONSHIP UI 
                
            } catch (error) {
                console.error(error);            
            } finally {
                hidePageLoader();
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
            setHasChanges(false);
        } catch (error) {
            console.error("Error saving relationships:", error);
        }
    };

    const availableChars = getAvailableCharacters();

    const characterRelationshipChangeHandler = (characterId: string) => {
        setRelationshipToCurrentCharacter(null)
        setNewRelationship(prev => ({ ...prev, characterId }));
        
        let selectedCharacter = allAvailableCharacters.find(item => item.public_id === characterId);
        console.log({
            allAvailableCharacters,
            characterId,
            selectedCharacter
        });
        if(selectedCharacter?.relationshipToOtherCharacters && selectedCharacter?.relationshipToOtherCharacters?.length > 0){
            let relationship = selectedCharacter?.relationshipToOtherCharacters?.find(item => item.id === currentCharacter?.public_id);
            console.log({
                relationship
            });
            setCurrentSelectedCharacter(selectedCharacter?.name)
            setRelationshipToCurrentCharacter(relationship);            
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            {hasChanges && (
                <div className="flex justify-end gap-2 mb-6">
                    <button
                        onClick={handleCancelChanges}
                        className="flex items-center gap-2 px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
                    >
                        <X className="w-4 h-4" />
                        Cancel Changes
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    >
                        <Check className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            )}

            {/* Existing Relationships */}
            <div className="space-y-3 mb-6">
                {relationshipToOtherCharacters?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No relationships defined yet</p>
                        <p className="text-sm">Add relationships to build character depth</p>
                    </div>
                ) : (
                    relationshipToOtherCharacters?.map((rel) => (
                        <div key={rel.id} className="flex items-start justify-between p-4 bg-[#F9F9F9] rounded-lg transition-colors">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-blue-600 font-medium text-sm">
                                        {rel?.name?.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-xs text-gray-800 mb-2">{rel.name}</div>

                                    {editingId === rel.id ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editRelationship}
                                                onChange={(e) => setEditRelationship(e.target.value)}
                                                className="w-full px-3 py-2 text-xs border border-gray-100 rounded-lg focus:outline-none outline-none bg-white resize-none"
                                                placeholder="Describe the relationship in detail..."
                                                // id="edit-relationship"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => saveEdit(rel.id)}
                                                    className="flex items-center gap-1 px-3 py-1 text-xs cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center gap-1 px-3 py-1 cursor-pointer text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-600 leading-relaxed">{rel.relationship}</p>
                                            <button
                                                onClick={() => startEditing(rel.id, rel.relationship)}
                                                className="inline-flex items-center cursor-pointer gap-1 px-2 py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveRelationship(rel.id)}
                                className="p-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Relationship */}
            {!isAddingNew ? (
                <button
                    onClick={() => setIsAddingNew(true)}
                    disabled={availableChars.length === 0}
                    className="w-full p-4 border-2 text-xs border-dashed enabled:cursor-pointer border-gray-300 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-5 h-5 mx-auto mb-1" />
                    {availableChars.length === 0
                        ? "The character already has relationships with other characters"
                        : "Add Character Relationship"
                    }
                </button>
            ) : (
                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Character
                            </label>
                            <div className="border rounded-lg border-gray-300 w-full p-2 pb-[9px] pt-[9px]">
                                <select
                                    value={newRelationship.characterId}
                                    onChange={(e) => characterRelationshipChangeHandler(e.target.value) }
                                    className="w-full focus:outline-none text-xs outline-none"
                                >
                                    <option value="">Select a character...</option>
                                    {availableChars.map(char => (
                                        <option key={char.public_id} value={char.public_id}>
                                            {char.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Relationship
                            </label>
                            <input
                                type="text"
                                value={newRelationship.relationship}
                                onChange={(e) => setNewRelationship(prev => ({ ...prev, relationship: e.target.value }))}
                                placeholder="e.g., Mother, Friend, Rival, Mentor..."
                                className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:outline-none"
                            />
                        </div>
                    </div>
                    {relationshipToCurrentCharacter && 
                    <CompactRelationshipDisplay
						currentSelectedCharacter={currentSelectedCharacter}
						relationshipToCurrentCharacter={relationshipToCurrentCharacter}
					/>
                    // <div className="mb-4">
                    //     <p className="text-xs">{relationshipToCurrentCharacter?.name}'s relationship to {currentCharacter?.name} is below:</p>
                    //     <p className="text-xs capitalize">{relationshipToCurrentCharacter?.relationship}</p>
                    // </div>
                    }

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddRelationship}
                            disabled={!newRelationship.characterId || !newRelationship.relationship.trim()}
                            className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Relationship
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingNew(false);
                                setNewRelationship({ characterId: "", relationship: "" });
                            }}
                            className="px-4 py-2 border border-gray-300 text-xs text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Relationship Tips:</p>
                        <ul className="list-disc list-inside text-[11px] space-y-1 text-blue-700">
                            <li>Define how characters know each other</li>
                            <li>Consider emotional dynamics (love, conflict, dependency)</li>
                            <li>Think about power dynamics and influence</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};





const CompactRelationshipDisplay = ({ currentSelectedCharacter, relationshipToCurrentCharacter }) => {
    return (
        <div className="group relative mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 p-3 transition-all duration-200 ">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-900 truncate">
                            {currentSelectedCharacter}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="text-xs font-medium text-gray-700 truncate">
                            {relationshipToCurrentCharacter?.name}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed capitalize">
                        {relationshipToCurrentCharacter?.relationship}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CharacterRelationshipsUI;