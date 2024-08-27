import { useState, useEffect } from 'react'
import './Home.css'
import Navbar from './components/Navbar'
import BookSummary from './components/BookSummary'
import Footer from './components/Footer'
import Alert from './components/Alert'
import SearchResults from './components/SearchResults'
import Intro from './components/Intro'
import { nanoid } from 'nanoid'


export default function Home() {

  const [books, setBooks] = useState([])
  const [numBooks, setNumBooks] = useState(0)
  const [searchFormData, setSearchFormData] = useState({search_text: "", search_type: "text"})
  const [searchError, setSearchError] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [bookSummary, setBookSummary] = useState(false)
  const [bookResult, setBookResult] = useState({})
  const [bookReviews, setBookReviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)

    function fetch_api() {
      setIsLoading(true)
      setBooks([])
      let url = import.meta.env.VITE_API_URL + "/search/"
      if (searchFormData.search_type === "isbn") {
        url = url + "isbn:"
      }
      console.log(searchFormData.search_text)
      url = url + searchFormData.search_text
        fetch(url)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if (!res?.success) {
            setSearchError(true)
            setBookReviews(() => [])
            setBooks([])
            setNumBooks(0)
          } else {
            if (searchError) {
              setSearchError(false)
            }
            setBookReviews(() => [])
            setBooks(res?.items)
            setNumBooks(res?.items.length)
            console.log(numBooks)
          }
        })
        .catch(error => {
            setSearchError(true)
            setIsLoading(false)
        })
    }


    useEffect(() => {
      function get_open_library_path(isbn) {
        let url = `https://openlibrary.org/isbn/${isbn}.json`
        return fetch(url)
          .then(res => res.json())
          .then(res => res?.works[0]?.key)
          .catch(error => {
            console.log(`Error with Open Library ID search`)
            return undefined
          })
      }
  
      function get_book_rating(open_library_path) {
        let url = `https://openlibrary.org${open_library_path}/ratings.json`
        return fetch(url)
          .then(res => res.json())
          .then(res => {
            return res
          })
          .catch(error => {
            console.log("Error with book rating search", error)
            return undefined
          })
      }
  
      if (books?.length > 0) {
        let newReviews = []
        books.forEach(book => {
          const book_isbn = book?.volumeInfo?.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier
          if (book_isbn !== undefined) {
            get_open_library_path(book_isbn)
              .then(open_library_path => {
                if (open_library_path === undefined) {
                  console.log("Book not found")
                } else {
                  get_book_rating(open_library_path)
                    .then(review_result => {
                      if (review_result === undefined) {
                        console.log("Rating not found")
                      } else {
                        newReviews.push({isbn: book_isbn, ...review_result})
                      }
                    })
                }
              })
          }
        })
        setBookReviews(() => newReviews)
        setIsLoading(false)
      }
    }, [books])

  function handleFormChange(event) {
    setSearchFormData(prev => {
      return {
        ...prev,
        [event.target.name]: event.target.type === "checkbox" ? (event.target.checked ? "text" : "isbn"): event.target.value
      }
    })
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    setHasSearched(true)
    if (searchFormData.search_text.length === 0) {
      setSearchError(true)
    } else {
      setSearchError(false)
      fetch_api()
      setBookSummary(false)
    }
  }

  function handleReadMore(event) {
    event.preventDefault()
    setBookSummary(true)
    setBookResult(books.find(book => book.id === event.target.value))
  }

  function handleBackButton(event) {
    event.preventDefault()
    setBookSummary(false)
  }
  function handleNewSearch(event) {
    event.preventDefault()
    setBookSummary(false)
    setHasSearched(false)
  }

  return (
    <>
      <Navbar />
      { 
      !hasSearched 
      &&
      <Intro handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit} searchFormData={searchFormData} />
      }
      {
        isLoading &&
        <div className="flex justify-center h-screen">
            <span className="loading loading-spinner w-36 align-center m-10"></span>
        </div>
      }
      { (!bookSummary && hasSearched && numBooks > 0 && !searchError) &&
        <SearchResults books={books} reviews={bookReviews} handleReadMore={handleReadMore} handleNewSearch={handleNewSearch} /> 
      }
      { (bookSummary && hasSearched && numBooks > 0 && !searchError) &&
        <BookSummary 
          key={nanoid()}
          title={bookResult.volumeInfo.title}
          subtitle={bookResult.volumeInfo.subtitle} 
          authors={bookResult.volumeInfo.authors}
          description={bookResult.volumeInfo.description}
          page_count={bookResult.volumeInfo.pageCount}
          image_links={bookResult.volumeInfo.imageLinks}
          isbn={bookResult?.volumeInfo?.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier}
          review={bookReviews.find(x =>
              x.isbn === bookResult?.volumeInfo?.industryIdentifiers?.find(x => x.type === "ISBN_13")?.identifier
          )}
          handleBackButton={handleBackButton}
        /> 
      }  
      {/* only render booksummary if result is returned */}
      { !isLoading && searchError 
        &&
        <>
        <div className="back--button container mx-auto pl-5 pt-12 h-screen">
            <button type="button" onClick={handleNewSearch}>
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Back to Search</p>
                    </div>
            </button>
            <Alert text={"There was a server error. Please try again later."} />
        </div>
        </> 
      }
      { 
      (!isLoading && hasSearched && numBooks <= 0 && !searchError) 
      && 
      <>
        <div className="back--button container mx-auto pl-5 pt-12 h-screen">
            <button type="button" onClick={handleNewSearch}>
                    <div className="flex flex-row align-middle">
                        <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ml-2">Back to Search</p>
                    </div>
            </button>
            <Alert text={"No results for your query. Please refine your search."} />
        </div>
        </> 
      }
      <Footer />

    </>
  )
}
