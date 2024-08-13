import Footer from "./Footer";
import Logo from "./Logo";
import Navbar from "./Navbar";
// import bookshelf from "../images/bookshelf.png"

export default function About() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-24 mb-24">
                <div className="columns-1 lg:columns-2">
                    <div className="p-4 md:p-8">
                        <h1 className="text-primary font-bold text-5xl pb-4">About {import.meta.env.VITE_SITE_NAME}</h1>
                        <p className="text-2xl">{import.meta.env.VITE_SITE_NAME} is an easy way to search and share books online. {import.meta.env.VITE_SITE_NAME} allows you to share the books you read over the years with all of your friends using the virtual bookshelf. 
                            The source code for the project can be found on <a className="link" href="https://github.com/otjrocks/BookComb">Github</a>. 
                            The website and backend are hosted using Vercel and MongoDB Atlas.</p>
                        <br />
                        <h4 className="font-bold text-xl pb-3">Credits:</h4>
                        <ul className="list-disc text-lg pl-2 md:pl-0">
                            <li>
                            <span className="font-bold">Book Information, Reviews, and Covers: </span> <a className="link" href="https://openlibrary.org/dev/docs/api/covers">Open Library API</a>
                            </li>
                            <li>
                            <span className="font-bold">Book Search: </span> <a className="link" href="https://developers.google.com/books/docs/overview">Google Books API</a>
                            </li>
                            <li>
                            <span className="font-bold">Book Styling: </span> <a className="link" href="https://github.com/petargyurov/virtual-bookshelf">https://github.com/petargyurov/virtual-bookshelf</a>
                            </li>
                            <li>
                            <span className="font-bold">Bookshelf Styling: </span> <a className="link" href="https://codepen.io/tlauffs/pen/mdzzQZX">https://codepen.io/tlauffs/pen/mdzzQZX</a>
                            </li>
                            <li>
                            <span className="font-bold">Bookshelf Image: </span> <a className="link" href="https://pngimg.com/image/107080">https://pngimg.com/image/107080</a>
                            </li>
                        </ul>
                        <br />
                    </div>
                    <div className="p-4 md:p-8 lg:h-screen">
                    </div>
                    
                </div>
            </div>
            <Footer />
        </>
    )
}