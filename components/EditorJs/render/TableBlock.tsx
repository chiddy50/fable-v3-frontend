const TableBlock = ({ data }) => {
	const { withHeadings, content, stretched } = data;

	return (
		<div className={stretched ? 'w-full' : ''}>
			<table className="border-collapse border border-gray-300 w-full">
				<tbody>
					{content.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{row.map((cell, cellIndex) =>
								rowIndex === 0 && withHeadings ? (
									<th key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" />
								) : (
									<td key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} className="border border-gray-300 px-4 py-2" />
								)
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableBlock;