import DOMPurify from 'dompurify';

// Paragraph Block Component
const ParagraphBlock = ({ data }) => {
	const safeHTML = DOMPurify.sanitize(data.text);
	return <p className='my-5' dangerouslySetInnerHTML={{ __html: safeHTML }} />;
};

export default ParagraphBlock;