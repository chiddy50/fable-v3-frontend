import { useState, useMemo } from 'react';
import { Search, Filter, Heart, User, Eye, Users, Star, Bookmark, Play, MoreHorizontal } from 'lucide-react';

const GeneratedCharacterList = ({ characters }) => {
    // // Sample data - in real app this would come from props or API
    // const [characters] = useState([
    //     {
    //         "id": "a7b2c9d4-e6f8-4123-b456-789012345678",
    //         "name": "Anya Petrova",
    //         "alias": "The Weaver",
    //         "gender": "Female",
    //         "age": "28",
    //         "role": "antagonist",
    //         "race": "Human",
    //         "backstory": "Anya's family was erased from existence due to a temporal paradox created by a rogue time traveler. This fuels her unwavering dedication to Chronos and her ruthless pursuit of timeline integrity.",
    //         "internalConflict": "Anya struggles with the moral implications of her actions, questioning whether preserving the timeline justifies the sacrifices she makes.",
    //         "externalConflict": "Anya is tasked with hunting down Ethan and correcting his temporal anomalies, putting her in direct conflict with him and his goals.",
    //         "relationshipToProtagonists": "Anya is a high-ranking Chronos agent, tasked with hunting Ethan down. She sees him as a dangerous threat to the timeline and is willing to do whatever it takes to stop him.",
    //         "weaknesses": "Anya's rigid adherence to Chronos's principles blinds her to alternative solutions and makes her vulnerable to manipulation.",
    //         "strengths": "Anya is highly skilled in combat, temporal mechanics, and manipulation. She is a formidable opponent with unwavering resolve.",
    //         "voice": "Authoritative, cold, and calculating, with a hint of underlying grief.",
    //         "perspective": "The timeline must be preserved at all costs, even if it means sacrificing individual lives.",
    //         "roleJustification": "As a Chronos agent, Anya can shapeshift her identity and appearance to blend into different timelines and infiltrate Ethan's inner circle.",
    //         "uniqueHook": "Anya possesses a unique temporal device that allows her to 'weave' minor alterations into the timeline, making her a subtle yet dangerous adversary."
    //     },
    //     // Adding a few more sample characters for demonstration
    //     {
    //         "id": "b8c3d0e5-f7g9-5234-c567-890123456789",
    //         "name": "Marcus Chen",
    //         "alias": "The Historian",
    //         "gender": "Male",
    //         "age": "45",
    //         "role": "mentor",
    //         "race": "Human",
    //         "backstory": "A former time agent turned rogue scholar, Marcus discovered forbidden knowledge about the true nature of time manipulation.",
    //         "internalConflict": "Marcus battles between his desire to share dangerous truths and his responsibility to protect others from that knowledge.",
    //         "externalConflict": "Marcus must evade both Chronos agents and temporal hunters while guiding the protagonist.",
    //         "relationshipToProtagonists": "A reluctant mentor who provides crucial information about time travel's hidden costs.",
    //         "weaknesses": "His paranoia and distrust make it difficult for him to form lasting alliances.",
    //         "strengths": "Vast knowledge of temporal mechanics and an extensive network of contacts across timelines.",
    //         "voice": "Cautious, scholarly, with bursts of passionate intensity when discussing temporal ethics.",
    //         "perspective": "Knowledge should be preserved and shared, even at great personal cost.",
    //         "roleJustification": "As a former insider, Marcus understands both the system and its flaws, making him invaluable.",
    //         "uniqueHook": "Marcus carries a collection of temporal artifacts that respond only to his touch."
    //     },
    //     {
    //         "id": "c9d4e1f6-g8h0-6345-d678-901234567890",
    //         "name": "Zara Al-Rashid",
    //         "alias": "Timekeeper",
    //         "gender": "Female",
    //         "age": "34",
    //         "role": "protagonist",
    //         "race": "Human",
    //         "backstory": "Born with a rare genetic mutation that allows her to perceive temporal fluctuations, Zara was recruited by a secret organization opposing Chronos.",
    //         "internalConflict": "Zara questions whether her natural abilities make her a freak of nature or evolution's answer to temporal tyranny.",
    //         "externalConflict": "Zara leads a resistance movement against Chronos while trying to prevent a temporal war.",
    //         "relationshipToProtagonists": "The primary protagonist fighting to free humanity from temporal control.",
    //         "weaknesses": "Her temporal sensitivity sometimes overwhelms her, causing debilitating visions.",
    //         "strengths": "Unparalleled ability to detect and navigate temporal anomalies, natural leadership.",
    //         "voice": "Determined, compassionate, with an underlying urgency driven by her visions.",
    //         "perspective": "Time belongs to all of humanity, not a select few who would control it.",
    //         "roleJustification": "Her unique abilities make her the only person capable of challenging Chronos effectively.",
    //         "uniqueHook": "Zara can 'see' the true age of objects and people, revealing their temporal history."
    //     }
    // ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedCharacters, setSelectedCharacters] = useState(new Set());
    const [savedCharacters, setSavedCharacters] = useState(new Set());
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    // Filter and search logic
    const filteredCharacters = useMemo(() => {
        return characters.filter(character => {
            const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                character.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
                character.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = selectedRole === 'all' || character.role === selectedRole;
            return matchesSearch && matchesRole;
        });
    }, [characters, searchTerm, selectedRole]);

    const roles = [...new Set(characters.map(c => c.role))];

    const toggleCharacterSelection = (id) => {
        const newSelected = new Set(selectedCharacters);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedCharacters(newSelected);
    };

    const toggleSaveCharacter = (id) => {
        const newSaved = new Set(savedCharacters);
        if (newSaved.has(id)) {
            newSaved.delete(id);
        } else {
            newSaved.add(id);
        }
        setSavedCharacters(newSaved);
    };

    const useCharacter = (character) => {
        alert(`Using character: ${character.name} (${character.alias})`);
        // In real app, this would trigger character usage logic
    };

    const saveSelectedCharacters = () => {
        if (selectedCharacters.size === 0) {
            alert('No characters selected to save');
            return;
        }

        selectedCharacters.forEach(id => {
            setSavedCharacters(prev => new Set([...prev, id]));
        });
        setSelectedCharacters(new Set());
        alert(`Saved ${selectedCharacters.size} character(s) for later use`);
    };

    const getRoleColor = (role) => {
        const colors = {
            protagonist: 'bg-blue-100 text-blue-800 border-blue-200',
            antagonist: 'bg-red-100 text-red-800 border-red-200',
            mentor: 'bg-green-100 text-green-800 border-green-200',
            sidekick: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            neutral: 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[role] || colors.neutral;
    };

    const CharacterCard = ({ character, isSelected, isSaved }) => (
        <div className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
            {/* Card Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{character.name}</h3>
                            {isSaved && <Bookmark className="w-4 h-4 text-amber-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600 italic">"{character.alias}"</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(character.role)}`}>
                                {character.role}
                            </span>
                            <span className="text-xs text-gray-500">{character.race} • {character.age} • {character.gender}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => toggleSaveCharacter(character.id)}
                            className={`p-2 rounded-lg transition-colors ${isSaved ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                                }`}
                            title={isSaved ? 'Remove from saved' : 'Save for later'}
                        >
                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={() => toggleCharacterSelection(character.id)}
                            className={`p-2 rounded-lg transition-colors ${isSelected ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            title={isSelected ? 'Deselect' : 'Select'}
                        >
                            <User className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Backstory</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{character.backstory}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Unique Hook</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{character.uniqueHook}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="font-medium text-gray-700">Voice:</span>
                            <p className="text-gray-600 mt-1 line-clamp-2">{character.voice}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Perspective:</span>
                            <p className="text-gray-600 mt-1 line-clamp-2">{character.perspective}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => useCharacter(character)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Play className="w-4 h-4" />
                        Use Character
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <Eye className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">Character Gallery</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''}
                                </span>
                                {savedCharacters.size > 0 && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                                        {savedCharacters.size} saved
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search characters..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCharacters.size > 0 && (
                                <button
                                    onClick={saveSelectedCharacters}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    Save Selected ({selectedCharacters.size})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Character Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredCharacters.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCharacters.map(character => (
                            <CharacterCard
                                key={character.id}
                                character={character}
                                isSelected={selectedCharacters.has(character.id)}
                                isSaved={savedCharacters.has(character.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneratedCharacterList;