import RatingStars from "./RatingStars"

export default function ReviewSummary(props) {
    const {stars, count, countOne, countTwo, countThree, countFour, countFive} = props

    let percOne, percTwo, percThree, percFour, percFive = 0
    const total = countOne + countTwo + countThree + countFour + countFive
    percOne = (countOne / total) * 100
    percTwo = (countTwo / total) * 100
    percThree = (countThree / total) * 100
    percFour = (countFour / total) * 100
    percFive = (countFive / total) * 100

    return (
        <>
        <RatingStars stars={stars} />
            <div className="flex">
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stars.toFixed(2)}
                </p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
            </div>
            <br />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{count} total reviews</p>
            <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-primary">5 star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div className="h-5 bg-primary rounded" style={{ width: `${percFive.toFixed(0)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percFive.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-primary">4 star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div className="h-5 bg-primary rounded" style={{ width: `${percFour.toFixed(0)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percFour.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-primary">3 star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div className="h-5 bg-primary rounded" style={{ width: `${percThree.toFixed(0)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percThree.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-primary">2 star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div className="h-5 bg-primary rounded" style={{ width: `${percTwo.toFixed(0)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percTwo.toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-primary">1 star</span>
                <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
                    <div className="h-5 bg-primary rounded" style={{ width: `${percOne.toFixed(0)}%` }}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{percOne.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-gray-500 pt-2">* Percentages are rounded</p>
        </>
    )
}