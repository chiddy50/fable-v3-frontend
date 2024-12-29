// Image Block Component
const ImageBlock = ({ data }) => {
	return (
		<div className="image-block">
			<img src={data.file.url} alt={data.caption} className='my-5 w-full' />
			{data.caption && <p>{data.caption}</p>}
		</div>
	);
};

export default ImageBlock;