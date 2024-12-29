'use client';

const StarRatingComponent = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-1">
            <i className={`bx text-xl ${rating > 0 ? 'text-yellow-500 bxs-star': 'text-yellow-500 bx-star' }`}></i>
            <i className={`bx text-xl ${rating > 1 ? 'text-yellow-500 bxs-star': 'text-yellow-500 bx-star' }`}></i>
            <i className={`bx text-xl ${rating > 2 ? 'text-yellow-500 bxs-star': 'text-yellow-500 bx-star' }`}></i>
            <i className={`bx text-xl ${rating > 3 ? 'text-yellow-500 bxs-star': 'text-yellow-500 bx-star' }`}></i>
            <i className={`bx text-xl ${rating > 4 ? 'text-yellow-500 bxs-star': 'text-yellow-500 bx-star' }`}></i>
        </div>
    )
}

export default StarRatingComponent
