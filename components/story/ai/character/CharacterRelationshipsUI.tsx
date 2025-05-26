"use client";

import React, { useState } from 'react';
import { Plus, X, Users, Edit3, Check, AlertCircle, XCircle } from 'lucide-react';
import { StoryInterface } from '@/interfaces/StoryInterface';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { SynopsisInterface } from '@/interfaces/SynopsisInterface';
import { hidePageLoader, showPageLoader } from '@/lib/helper';

interface Props {
    relationshipToOtherCharacters: any[];
    setRelationshipToOtherCharacters: React.Dispatch<React.SetStateAction<any[]>>;  
    currentCharacter: any;
    allAvailableCharacters: any[];
    story: StoryInterface;
    setStory: React.Dispatch<React.SetStateAction<StoryInterface>>;
    activeSynopsis: SynopsisInterface;
}

const CharacterRelationshipsUI: React.FC<Props> = ({
    currentCharacter,
    relationshipToOtherCharacters,
    setRelationshipToOtherCharacters,
    allAvailableCharacters,
    story,
    activeSynopsis,
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
    const [hasChanges, setHasChanges] = useState(false);

    // Get characters not yet in relationships
    const getAvailableCharacters = () => {
        const usedIds = relationshipToOtherCharacters.map(rel => rel.id);
        return allAvailableCharacters.filter(char => !usedIds.includes(char.id));
    };

    // Add new relationship
    const handleAddRelationship = () => {
        if (!newRelationship.characterId || !newRelationship.relationship.trim()) {
            return;
        }

        const selectedChar = allAvailableCharacters.find(char => char.id === newRelationship.characterId);
        if (!selectedChar) return;

        const newRel = {
            id: selectedChar.id,
            name: selectedChar.name,
            relationship: newRelationship.relationship.trim()
        };

        setRelationshipToOtherCharacters(prev => [...prev, newRel]);
        setNewRelationship({ characterId: "", relationship: "" });
        setIsAddingNew(false);
        setHasChanges(true);
    };

    // Remove relationship
    const handleRemoveRelationship = (id) => {
        setRelationshipToOtherCharacters(prev => prev.filter(rel => rel.id !== id));
        setHasChanges(true);
    };

    // Start editing relationship
    const startEditing = (id, currentRelationship) => {
        setEditingId(id);
        setEditRelationship(currentRelationship);
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
        setHasChanges(true);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditRelationship("");
    };

    // Save all changes
    const handleSaveChanges = async () => {
        try {
            console.log("Saving relationships:", relationshipToOtherCharacters);

            let payload = {
                characterId: currentCharacter.id,
                relationshipToOtherCharacters,
                synopsisId: activeSynopsis?.id,
                storyId: story?.id
            }
            console.log(payload);

            try {            
                showPageLoader();
                const url = `${process.env.NEXT_PUBLIC_BASE_URL}/v2/stories/${story?.id}/synopsis-character`;
                let res = await axiosInterceptorInstance.put(url, payload);
                console.log(res);
                // setStory(res?.data?.story);
                
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

    return (
        <div className="w-full">
            {/* Header */}
            {hasChanges && (
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleSaveChanges}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
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
                        <div key={rel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">
                                        {rel?.name?.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="font-medium text-xs text-gray-800">{rel.name}</div>

                                    {editingId === rel.id ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="text"
                                                value={editRelationship}
                                                onChange={(e) => setEditRelationship(e.target.value)}
                                                className="px-2 py-1 text-xs border rounded focus:outline-none outline-none "
                                                placeholder="Relationship type"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => saveEdit(rel.id)}
                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-600">{rel.relationship}</span>
                                            <button
                                                onClick={() => startEditing(rel.id, rel.relationship)}
                                                className="p-1 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleRemoveRelationship(rel.id)}
                                className="p-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
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
                        ? "All characters already have relationships"
                        : "Add Character Relationship"
                    }
                </button>
            ) : (
                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                                Character
                            </label>
                            <div className="border rounded-lg border-gray-300 w-full p-2 pb-[9px] pt-[9px]">
                                <select
                                    value={newRelationship.characterId}
                                    onChange={(e) => setNewRelationship(prev => ({ ...prev, characterId: e.target.value }))}
                                    className="w-full focus:outline-none text-xs outline-none"
                                >
                                    <option value="">Select a character...</option>
                                    {availableChars.map(char => (
                                        <option key={char.id} value={char.id}>
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

export default CharacterRelationshipsUI;