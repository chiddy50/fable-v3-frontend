import DOMPurify from 'dompurify';

const QuoteBlock = ({ data }) => {
	const safeText = DOMPurify.sanitize(data.text);
	const safeCaption = DOMPurify.sanitize(data.caption);
	const alignmentClass = data.alignment === 'center'
		? 'text-center'
		: data.alignment === 'right'
			? 'text-right'
			: 'text-left';

	return (
		<blockquote className={`border-l-4 border-gray-500 pl-4 italic my-5 ${alignmentClass}`}>
			<p className="text-xl mb-2" dangerouslySetInnerHTML={{ __html: safeText }} />
			{data.caption && (
				<footer className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: safeCaption }} />
			)}
		</blockquote>
	);
};
export default QuoteBlock;