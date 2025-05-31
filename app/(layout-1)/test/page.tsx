"use client"
import React from 'react';
import { Users, Heart, Zap, Shield, Sword, Crown } from 'lucide-react';

// Sample data for demonstration
const sampleData = {
	currentCharacter: { name: "Emily Miller" },
	relationshipToCurrentCharacter: {
		name: "Carol Miller",
		relationship: "Mother, someone she wants to please but also feels pressured by"
	}
};

// Additional sample relationships for variety
const sampleRelationships = [
	{
		currentCharacter: { name: "Max Miller" },
		relationshipToCurrentCharacter: {
			name: "George Miller",
			relationship: "Father, someone he admires for his optimism but struggles to connect with on an artistic level"
		}
	},
	{
		currentCharacter: { name: "George Miller" },
		relationshipToCurrentCharacter: {
			name: "Brenda Stern",
			relationship: "nemesis"
		}
	},
	{
		currentCharacter: { name: "Carol Miller" },
		relationshipToCurrentCharacter: {
			name: "Emily Miller",
			relationship: "Daughter, someone she wants to inspire and impress"
		}
	}
];

const CharacterRelationshipCard = ({ currentCharacter, relationshipToCurrentCharacter }) => {
	// Function to get appropriate icon based on relationship type
	const getRelationshipIcon = (relationship) => {
		const rel = relationship.toLowerCase();
		if (rel.includes('mother') || rel.includes('father') || rel.includes('daughter') || rel.includes('son')) {
			return <Heart className="w-4 h-4 text-pink-500" />;
		} else if (rel.includes('enemy') || rel.includes('nemesis')) {
			return <Sword className="w-4 h-4 text-red-500" />;
		} else if (rel.includes('friend') || rel.includes('ally')) {
			return <Shield className="w-4 h-4 text-green-500" />;
		} else if (rel.includes('rival') || rel.includes('competitor')) {
			return <Zap className="w-4 h-4 text-yellow-500" />;
		} else if (rel.includes('mentor') || rel.includes('guide')) {
			return <Crown className="w-4 h-4 text-purple-500" />;
		}
		return <Users className="w-4 h-4 text-blue-500" />;
	};

	// Function to get background gradient based on relationship type
	const getRelationshipGradient = (relationship) => {
		const rel = relationship.toLowerCase();
		if (rel.includes('mother') || rel.includes('father') || rel.includes('daughter') || rel.includes('son')) {
			return 'from-pink-50 to-rose-50 border-pink-200';
		} else if (rel.includes('enemy') || rel.includes('nemesis')) {
			return 'from-red-50 to-orange-50 border-red-200';
		} else if (rel.includes('friend') || rel.includes('ally')) {
			return 'from-green-50 to-emerald-50 border-green-200';
		} else if (rel.includes('rival') || rel.includes('competitor')) {
			return 'from-yellow-50 to-amber-50 border-yellow-200';
		} else if (rel.includes('mentor') || rel.includes('guide')) {
			return 'from-purple-50 to-violet-50 border-purple-200';
		}
		return 'from-blue-50 to-indigo-50 border-blue-200';
	};

	return (
		<div className={`relative overflow-hidden rounded-xl border-2 bg-gradient-to-br p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getRelationshipGradient(relationshipToCurrentCharacter?.relationship || '')}`}>
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
			<div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

			{/* Main content */}
			<div className="relative z-10">
				{/* Header with icon */}
				<div className="flex items-center gap-3 mb-3">
					<div className="flex-shrink-0">
						{getRelationshipIcon(relationshipToCurrentCharacter?.relationship || '')}
					</div>
					<div className="flex-1">
						<h3 className="text-sm font-semibold text-gray-800 leading-tight">
							Character Relationship
						</h3>
					</div>
				</div>

				{/* Character names with connection */}
				<div className="space-y-2 mb-3">
					<div className="flex items-center justify-between">
						<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-700 border border-white/40">
							{relationshipToCurrentCharacter?.name}
						</span>
						<div className="flex-1 mx-3 border-t border-dashed border-gray-300"></div>
						<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-700 border border-white/40">
							{currentCharacter?.name}
						</span>
					</div>
				</div>

				{/* Relationship description */}
				<div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/40">
					<p className="text-sm text-gray-700 leading-relaxed capitalize">
						<span className="font-medium text-gray-800">Relationship:</span>{' '}
						{relationshipToCurrentCharacter?.relationship}
					</p>
				</div>
			</div>
		</div>
	);
};

// Alternative compact version
const CompactRelationshipDisplay = ({ currentCharacter, relationshipToCurrentCharacter }) => {
	return (
		<div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 p-3 transition-all duration-200 hover:shadow-md hover:border-gray-300">
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0 mt-0.5">
					<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
						<Users className="w-4 h-4 text-white" />
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-sm font-medium text-gray-900 truncate">
							{relationshipToCurrentCharacter?.name}
						</span>
						<span className="text-gray-400">→</span>
						<span className="text-sm font-medium text-gray-700 truncate">
							{currentCharacter?.name}
						</span>
					</div>
					<p className="text-xs text-gray-600 leading-relaxed capitalize">
						{relationshipToCurrentCharacter?.relationship}
					</p>
				</div>
			</div>
		</div>
	);
};

// Main component with examples
const CharacterRelationshipShowcase = () => {
	return (
		<div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Character Relationship Display</h1>
				<p className="text-gray-600">Modern designs for displaying character relationships</p>
			</div>

			{/* Enhanced card version */}
			<div className="mb-12">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">Enhanced Card Design</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<CharacterRelationshipCard
						currentCharacter={sampleData.currentCharacter}
						relationshipToCurrentCharacter={sampleData.relationshipToCurrentCharacter}
					/>
					{sampleRelationships.slice(0, 3).map((relationship, index) => (
						<CharacterRelationshipCard
							key={index}
							currentCharacter={relationship.currentCharacter}
							relationshipToCurrentCharacter={relationship.relationshipToCurrentCharacter}
						/>
					))}
				</div>
			</div>

			{/* Compact version */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">Compact Design</h2>
				<div className="space-y-3">
					<CompactRelationshipDisplay
						currentCharacter={sampleData.currentCharacter}
						relationshipToCurrentCharacter={sampleData.relationshipToCurrentCharacter}
					/>
					{sampleRelationships.map((relationship, index) => (
						<CompactRelationshipDisplay
							key={index}
							currentCharacter={relationship.currentCharacter}
							relationshipToCurrentCharacter={relationship.relationshipToCurrentCharacter}
						/>
					))}
				</div>
			</div>

			{/* Usage instructions */}
			<div className="bg-white rounded-lg p-6 border border-gray-200">
				<h3 className="text-lg font-semibold text-gray-800 mb-3">Usage</h3>
				<div className="bg-gray-50 rounded-md p-4 font-mono text-sm">
					<div className="text-gray-700">
						{`<CharacterRelationshipCard 
  currentCharacter={currentCharacter}
  relationshipToCurrentCharacter={relationshipToCurrentCharacter}
/>`}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CharacterRelationshipShowcase;