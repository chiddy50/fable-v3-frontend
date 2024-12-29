// List Block Component
// const ListBlock = ({ data }) => {
//     const isOrdered = data.style === 'ordered';
//     return isOrdered ? (
//         <ol>
//         {data.items.map((item, index) => (
//             <li key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
//         ))}
//         </ol>
//     ) : (
//         <ul>
//         {data.items.map((item, index) => (
//             <li key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
//         ))}
//         </ul>
//     );
// };
const ListBlock = ({ data }) => {
	const isOrdered = data.style === 'ordered';
	const counterType = data.meta?.counterType || 'numeric'; // Optional meta to customize list counters

	const getCounterStyle = () => {
		if (counterType === 'numeric') return 'list-decimal'; // 1, 2, 3...
		if (counterType === 'lower-alpha') return 'list-lower-alpha'; // a, b, c...
		if (counterType === 'upper-alpha') return 'list-upper-alpha'; // A, B, C...
		if (counterType === 'lower-roman') return 'list-lower-roman'; // i, ii, iii...
		if (counterType === 'upper-roman') return 'list-upper-roman'; // I, II, III...
		return 'list-decimal'; // Default to numeric
	};

	const renderListItems = (items) => {
		return items.map((item, index) => {
			const uniqueKey = `list-item-${index}-${item.content || ''}`;
			const safeContent = DOMPurify.sanitize(item.content);

			return (
				<li key={uniqueKey} className="mb-2">
					<div dangerouslySetInnerHTML={{ __html: safeContent }} />
					{item.items && item.items.length > 0 && (
						<ListBlock data={{ style: data.style, items: item.items, meta: {} }} />
					)}
				</li>
			);
		});
	};

	return isOrdered ? (
		<ol className={`${getCounterStyle()} ml-5 mb-7`}>
			{renderListItems(data.items)}
		</ol>
	) : (
		<ul className="list-disc ml-5 mb-7">
			{renderListItems(data.items)}
		</ul>
	);
};

export default ListBlock;
