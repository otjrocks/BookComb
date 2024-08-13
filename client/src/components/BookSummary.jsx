import { nanoid } from "nanoid"
import ReviewSummary from "./ReviewSummary"
import AddBookshelf from "./AddBookshelf"
import { useEffect } from "react";

export default function BookSummary(props) {
    const {title, subtitle, authors, description, page_count, image_links, handleBackButton, isbn, review} = props;
    const authors_text = authors?.map(author => <div key={nanoid()}><span className="author">{author} </span><br/></div> )

    useEffect(() => { // scroll to top of page whenever search results is rendered
        window.scrollTo(0, 0)
    }, [])

    return ( 
    <> 
    <section className="book--summary bg-base-200 pt-10">
        <div className="back--button container mx-auto pl-5">
            <button type="button" onClick={handleBackButton}>
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Back to Results</p>
                    </div>
            </button>
        </div>
        <div className="hero pt-10 pb-4">
            <div className="hero-content flex-col lg:flex-row">
                <img
                src={image_links?.thumbnail}
                className="book--image max-w-sm rounded-lg shadow-2xl"/>
                <div className="pl-5 max-w-2xl">
                <h1 className="text-5xl font-bold text-primary">{title}</h1>
                <h2 className="text-3xl pt-1 text-slate-600 max-w-lg">{subtitle}</h2>
                {authors && <h3 className="text-xl pt-4 text-slate-500">By: {authors_text}</h3>}
                <AddBookshelf 
                    isbn={isbn} 
                    title={title} 
                    subtitle={subtitle} 
                    author={authors?.length > 0 ? authors[0] : ''} 
                    coverImage={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`} 
                    year={new Date().getFullYear()} 
                />
                </div>
            </div>
            
        </div>
        <div className="bg-base-200 pt-4 pb-10">
            <div className="book--details container mx-auto px-8">
            {
                review?.summary?.average !== undefined && review?.summary?.average !== null &&
                <div>
                    <ReviewSummary 
                        stars={review?.summary?.average} 
                        count={review?.summary?.count} 
                        countOne={review?.counts[1]}
                        countTwo={review?.counts[2]}
                        countThree={review?.counts[3]}
                        countFour={review?.counts[4]}
                        countFive={review?.counts[5]}
                    />
                </div>
                }
                {
                description 
                && 
                <>
                    <h2 className="text-2xl font-bold mt-5">Description:</h2>
                    <p className="text-lg pt-1 pb-5">
                        {description}
                    </p>
                </>
                }
                {
                page_count
                && 
                <>
                    <h2 className="text-2xl font-bold">Pages:</h2>
                    <p className="text-lg pt-1 pb-5">
                        {page_count}
                    </p>
                </>
                }
                {
                isbn 
                &&
                <>
                    <h2 className="text-2xl font-bold">ISBN (13):</h2>
                    <p className="text-lg pt-1 pb-5"> 
                        {isbn}
                    </p>
                </>
                }
            </div>
        </div>
    </section>
    </>
    )
}