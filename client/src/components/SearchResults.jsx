import React, { useMemo, useEffect } from "react";
import placeholder_image from "../images/no-image.svg";
import { nanoid } from "nanoid";
import AddBookshelf from "./AddBookshelf";

export default function SearchResults(props) {
    const { books, reviews, handleReadMore, handleNewSearch} = props;

    useEffect(() => { // scroll to top of page whenever search results is rendered
        window.scrollTo(0, 0)
    }, [])

    // Memoize the bookValues to avoid unnecessary recalculations
    const bookValues = useMemo(() => {
        return books.map(book => {

            return (
                <div key={nanoid()}>
                    <div className="mx-5 pb-10">
                        <div className="card bg-base-100 w-80 shadow-xl">
                            <figure>
                                <img
                                    className="pt-2"
                                    src={book.volumeInfo.imageLinks?.thumbnail ? book.volumeInfo.imageLinks?.thumbnail : placeholder_image}
                                    alt="Book Cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{book.volumeInfo.title}</h2>
                                <h3 className="card-subtitle">{book.volumeInfo.subtitle}</h3>
                                <div>
                                    {book.volumeInfo.authors && book.volumeInfo.authors.map(author => (
                                        <div key={nanoid()}>
                                            <span className="author">{author}</span><br/>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-actions justify-end">
                                    <AddBookshelf 
                                        isbn={book.volumeInfo?.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier} 
                                        title={book.volumeInfo?.title}
                                        subtitle={book.volumeInfo?.subtitle}
                                        author={book.volumeInfo?.authors && book.volumeInfo.authors.length > 0 ? book.volumeInfo.authors[0] : ''}
                                        coverImage={`https://covers.openlibrary.org/b/isbn/${book.volumeInfo?.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier}-L.jpg`} 
                                        year={new Date().getFullYear()} 
                                    />
                                    <button className="btn btn-sm mt-5" onClick={handleReadMore} value={book.id}>Read more</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }, [books, reviews, handleReadMore]);

    return (
        <>
        <div className="bg-base-200 flex justify-start p-10 pb-0">
        <div className="back--button container mx-auto pl-5">
            <button type="button" onClick={handleNewSearch}>
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Back to Search</p>
                    </div>
            </button>
        </div>
        </div>
        <div className="bg-base-200 flex justify-center p-10 pb-0">
                <h1 className="text-4xl font-bold">Search Results</h1>
        </div>
        <div className="flex flex-wrap mx-auto justify-center bg-base-200 pt-10">
            {bookValues}
        </div>
        </>
    );
}
