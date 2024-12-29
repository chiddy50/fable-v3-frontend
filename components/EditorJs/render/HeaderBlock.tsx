// Header Block Component
const HeaderBlock = ({ data }) => {
	// const safeHTML = DOMPurify.sanitize(data.text);
	if (data.level === 1) {
		return <h1 className='text-4xl font-bold mb-3' dangerouslySetInnerHTML={{ __html: data.text }} />;
	}
	if (data.level === 2) {
		return <h2 className='text-3xl font-bold mb-3' dangerouslySetInnerHTML={{ __html: data.text }} />;
	}
	if (data.level === 3) {
		return <h3 className='text-2xl font-bold mb-3' dangerouslySetInnerHTML={{ __html: data.text }} />;
	}
	if (data.level === 6) {
		return <h6 className='text-xl font-bold mb-3' dangerouslySetInnerHTML={{ __html: data.text }} />;
	}
};

export default HeaderBlock;