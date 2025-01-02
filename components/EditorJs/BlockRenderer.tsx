"use client";

import React from 'react';
import GetCodeBlock from '@/components/EditorJs/render/GetCodeBlock';
import CustomEmbed from '@/components/EditorJs/render/CustomEmbedBlock';
import HeaderBlock from '@/components/EditorJs/render/HeaderBlock';
import QuoteBlock from '@/components/EditorJs/render/QuoteBlock';
import ListBlock from '@/components/EditorJs/render/ListBlock';
import TableBlock from '@/components/EditorJs/render/TableBlock';
import ImageBlock from '@/components/EditorJs/render/ImageBlock';
import ParagraphBlock from '@/components/EditorJs/render/ParagraphBlock';
import RawBlock from '@/components/EditorJs/render/RawBlock';


// Main Block Renderer
const BlockRenderer = ({ blocks, article, accessRecord, isFree, action, getArticle }) => {
	let foundPaywall = false; // Flag to track if we've hit the paywall

	return (
		<>
			{blocks.map((block, index) => {
				const uniqueKey = `${block.type}-${index}-${block.id || Date.now()}`;

				// If paywall has been encountered and the user hasn't paid, blur the remaining content
				if (foundPaywall && !isFree) {
					// if (foundPaywall && !paid) {
					return null; // Stop rendering further blocks
					// return (
					//     <div key={uniqueKey} className="blurred-content">
					//         <BlurredContent blocks={blocks.slice(index)} />
					//     </div>
					// );
				}

				// Check for the paywall block
				if (block.type === 'paywall' && accessRecord.hasAccess === false) {
					foundPaywall = true;
					return (
						<div key={uniqueKey} className="flex flex-col items-center gap-3 my-10">
							<GetCodeBlock 
								amount={(article?.price)} 
								article={article}
								accessRecord={accessRecord}
								depositAddress={article?.user?.depositAddress}
								getArticle={getArticle}
							/>		
							<p className='text-xs'>Kindly make a payment of ${`${article?.price} to continue`}</p>				
						</div>
					);
				}

				// Render the rest of the blocks as normal
				switch (block.type) {
					case 'youtube':
						return <CustomEmbed key={uniqueKey} data={block.data} />;
					case 'header':
						return <HeaderBlock key={uniqueKey} data={block.data} />;
					case 'paragraph':
						return <ParagraphBlock key={uniqueKey} data={block.data} />;
					case 'list':
						return <ListBlock key={uniqueKey} data={block.data} />;
					case 'image':
						return <ImageBlock key={uniqueKey} data={block.data} />;
					case 'quote':
						return <QuoteBlock key={uniqueKey} data={block.data} />;
					case 'table':
						return <TableBlock key={uniqueKey} data={block.data} />;
					case 'raw': // Handle raw HTML block
						return <RawBlock key={uniqueKey} data={block.data} />;
					default:
						return null;
				}
			})}
		</>
	);
};

// Blurred Content Component (for post-paywall content)
const BlurredContent = ({ blocks }) => {
	return (
		<div className="backdrop-blur-md opacity-50 pointer-events-none">
			{blocks.map((block, index) => {
				const uniqueKey = `${block.type}-${index}-${block.id || Date.now()}`;

				switch (block.type) {
					case 'Youtube':
						return <CustomEmbed key={uniqueKey} data={block} />
					case 'header':
						return <HeaderBlock key={uniqueKey} data={block.data} />;
					case 'paragraph':
						return <ParagraphBlock key={uniqueKey} data={block.data} />;
					case 'list':
						return <ListBlock key={uniqueKey} data={block.data} />;
					case 'image':
						return <ImageBlock key={uniqueKey} data={block.data} />;
					default:
						return null;
				}
			})}
		</div>
	);
};

export default BlockRenderer;
