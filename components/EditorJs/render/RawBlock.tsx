import DOMPurify from 'dompurify';

// Raw Block Component
const RawBlock = ({ data }) => {
	const safeHTML = DOMPurify.sanitize(data.html, {
		ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li'],
		ALLOWED_ATTR: []
	});
	// const safeHTML = DOMPurify.sanitize(data.html); // Sanitize the raw HTML
	return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />;
};

export default RawBlock;