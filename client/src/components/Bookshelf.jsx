import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { nanoid } from "nanoid";
import './bookshelf.css';
import EditBookshelf from "./EditBookshelf";
import { Analytics } from "@vercel/analytics/react";

export default function Bookshelf(props) {
    function getRootCssStyles(rootRule = ":root") {
        const cssRulesArray = [...document.styleSheets].flatMap(styleSheet => {
            try {
                return [...styleSheet.cssRules];
            } catch (e) {
                return [];
            }
        });

        const cssVars = [];
        cssRulesArray.forEach(ruleElement => {
            if (ruleElement.selectorText === rootRule) {
                [...ruleElement.style].forEach(style => {
                    if (style.startsWith('--spine-') && !cssVars.includes(style)) {
                        cssVars.push(style);
                    }
                });
            }
        });

        return cssVars;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function getInitials(author) {
        const name = author.split(" ")
        if (name.length < 2) {
            return ''
        }
        if (name[1].length === 0) {
            return name[0][0]
        }
        return name[0][0] + name[1][0]
    }

    const availablePatterns = getRootCssStyles();

    const availableColors = [
        "maroon",
        "darkgreen",
        "darkolivegreen",
        "brown",
        "saddlebrown",
        "sienna",
        "midnightblue",
    ];
    let { id } = props;
    if (useParams()?.id !== undefined) {
        id = useParams().id
    }
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("Error: Unable to load bookshelf. Try adding books.");
    const [books, setBooks] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [user, setUser] = useState({ authenticated: false, email: "", username: "" });
    const [isTable, setIsTable] = useState(JSON.parse(localStorage.getItem('istable')));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        localStorage.setItem('istable', JSON.stringify(isTable));
    }, [isTable]);

    useEffect(() => {
        const request = new Request(`${import.meta.env.VITE_API_URL}/users/info`, {
            method: "GET",
            credentials: "include",
        });
        fetch(request)
            .then(res => res.json())
            .then(res => {
                setUser(res);
                if (res?.authenticated && res?.username === id) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            })
            .catch(err => 
                {
                    console.log(err);
                    setIsOwner(false);
                }
            );
    }, []);

    useEffect(() => {
        async function get_books() {
            try {
                setIsLoading(true);
                // Fetch bookshelf data
                const bookshelfUrl = `${import.meta.env.VITE_API_URL}/bookshelfs/get/${id}`;
                const bookshelfResponse = await fetch(bookshelfUrl);
                const bookshelfResult = await bookshelfResponse.json();
                
                if (!bookshelfResult?.success) {
                    setIsValid(false);
                    setErrorMessage(bookshelfResult?.message);
                    return;
                }

                // Fetch books data
                const booksUrl = `${import.meta.env.VITE_API_URL}/books/get/${id}`;
                const booksResponse = await fetch(booksUrl);
                const booksResult = await booksResponse.json();
                
                if (!booksResult?.success) {
                    setIsValid(false);
                    setErrorMessage(booksResult?.message);
                    return;
                }

                // Combine and sort results
                const booksMap = new Map(booksResult.books.map(book => [book.isbn, book]));
                const sortedBooks = bookshelfResult.bookshelf.map(entry => {
                    const book = booksMap.get(entry.isbn);
                    return {
                        isbn: entry.isbn,
                        img_url: book?.coverImage,
                        title: book?.title,
                        subtitle: book?.subtitle,
                        author: book?.author,
                        year: entry.year
                    };
                }).sort((a, b) => b.year - a.year);

                setBooks(sortedBooks);
                setIsValid(true);

            } catch (error) {
                setIsValid(false);
                setErrorMessage("Unable to retrieve books. Try adding books.");
            } finally {
                setIsLoading(false);
            }
        }

        get_books();
    }, [id]);

    function handleDelete(event) {
        event.preventDefault();
        let isbn = event.target.value;
        let url = `${import.meta.env.VITE_API_URL}/bookshelfs/remove/${isbn}/`;
        const request = new Request(url, {
            method: "POST",
            credentials: "include",
        });
        fetch(request)
            .then(res => res.json())
            .then(() => {
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    function groupBooksByYear(books) {
        return books.reduce((acc, book) => {
            const year = book.year || "Unknown Year";
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(book);
            return acc;
        }, {});
    }

    const groupedBooks = groupBooksByYear(books);
    const sortedYears = Object.keys(groupedBooks).sort((a, b) => b - a);

    const bookItems = (year) => groupedBooks[year].map(book => {
        let screenWidth = screen.width;
        let randomHeight;
        if (screenWidth < 768) { // same as css media query
            randomHeight = getRandomInt(200, 260);
        } else {
            randomHeight = getRandomInt(240, 300);
        }
        let randomPattern = randomChoice(availablePatterns);
        let randomColor = randomChoice(availableColors);
        return (
            <div key={nanoid()} className="book m-1 mt-5 md:m-3 lg:m-5">
                <div className="side spine" style={{
                    backgroundImage: `var(${randomPattern})`,
                    backgroundColor: randomColor,
                    height: `${randomHeight}px`,
                    top: `${280 - randomHeight}px`,
                }}>
                    <span className="spine-title">
                        <h3>{book?.title}</h3>
                        {book?.subtitle && <h4 className="spine-subtitle">{book?.subtitle}</h4>}
                    </span>
                    <span className="spine-author">{getInitials(book?.author)}</span>
                </div>
                <div className="side top" style={{ top: `${280 - randomHeight}px`, backgroundColor: randomColor, backgroundImage: `var(${randomPattern})` }}></div>
                <div className="side cover" style={{
                    height: `${randomHeight}px`,
                    top: `${280 - randomHeight}px`,
                    backgroundColor: randomColor,
                    backgroundImage: `url(${book?.img_url})`,
                }}>
                </div>
            </div>
        );
    });

    const bookItemsTable = (year) => groupedBooks[year].map(book => {
        return (
            <tr key={nanoid()}>
                <td className="bookshelf--table--text">
                    {
                        <img 
                        src={book?.img_url}
                        alt={`${book?.title} Cover Image`}
                        className="min-w-14 w-full md:w-16 lg:w-24 xl:w-28"
                        />
                    }
                </td>
                <td className="bookshelf--table--text">
                    <h3 className="font-bold text-xl">
                        {book?.title}
                    </h3>
                    <h4 className="text-md">
                        {book?.subtitle}
                    </h4>
                </td>
                <td className="bookshelf--table--text">{book?.author}</td>
                <td className="bookshelf--table--text">{book?.isbn}</td>
                {isOwner &&
                <>
                    <td className="flex flex-col">
                        <EditBookshelf
                                        isbn={book?.isbn} 
                                        title={book?.title}
                                        subtitle={book?.subtitle}
                                        author={book?.author}
                                        coverImage={book?.img_url} 
                                        year={book?.year} 
                        />
                        <button onClick={handleDelete} value={book?.isbn} className="delete--button mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-red-700">
                            X
                        </button>
                    </td>
                </>
                }
            </tr>
        );
    });

    const copyToClipboard = () => {
        const text = `${import.meta.env.VITE_SITE_URL}/bookshelf/${id}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }, () => {
            alert('Failed to copy link');
        });
    };

    return (
        <>  
            {
            isLoading ? 
            <div className="flex justify-center items-center">
                <span className="loading loading-spinner w-36 align-center m-10"></span>
            </div>
            :
            <>
            <div className="bookshelf--body">
                {isValid ?
                    <>
                        <h1 className="text-4xl md:text-5xl font-bold text-center pt-20 pb-20">{id}'s<br/>Bookshelf</h1>

                        {isOwner &&
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-md md:text-2xl text-center" onClick={copyToClipboard}>Share your bookshelf with friends using the link (click to copy):<br /> <span className="link">{import.meta.env.VITE_SITE_URL}/bookshelf/{id}</span></p>
                        </div>

                        }
                        {books?.length === 0 ?
                            <div className="text-4xl text-center pt-24 h-screen">
                                This bookshelf is empty
                            </div>
                            :
                            <div className="bookshelf align-center justify-center mx-auto p-6 sm:p-8 md:p-10 xl:p-16 w-11/12 md:w-10/12 lg:w-9/12">
                                {isOwner && !isTable && <div className="flex justify-end table--toggle font-bold text-2xl">Select Table View To Edit Books<br /><br /></div>}
                                <label className="flex cursor-pointer gap-2 justify-end table--toggle">
                                    Bookshelf
                                    <input 
                                            type="checkbox" 
                                            className="toggle table--toggle" 
                                            checked={isTable}
                                            onChange={() => setIsTable(prev => !prev)}
                                    />
                                    Table
                                </label>
                                {
                                isTable ?
                                <>
                                {sortedYears.map(year => (
                                    <div key={year}>
                                        <h2 className="bookshelf--year font-bold pl-6 pt-20 pb-6 text-3xl md:text-6xl text-primary w-full">{year}</h2>
                                        <div className="year--books">
                                        <div className="overflow-x-auto">
                                            <table className="bookshelf--table min-w-full table table-auto">
                                                <tbody>
                                                    <tr className="text-left bookshelf--table--text">
                                                        <th>Cover</th>
                                                        <th>Title</th>
                                                        <th>Author</th>
                                                        <th>ISBN</th>
                                                    </tr>
                                                    {bookItemsTable(year)}
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                    </div>
                                ))}
                                </>
                                :
                                <>
                                {sortedYears.map(year => (
                                    <div key={year}>
                                        
                                        <h2 className="bookshelf--year font-bold pl-6 pt-20 pb-6 text-3xl md:text-6xl text-primary w-full">{year}</h2>
                                        <div className="year--books">
                                        <div className="flex flex-wrap align-center justify-center p-2 mx-auto">
                                        {bookItems(year)}
                                        </div>
                                        </div>
                                    </div>
                                ))}
                                </> 
                                }
                            </div>
                        }
                    </>
                    :
                    <>
                        <h2 className="text-4xl text-center pt-24">{errorMessage}</h2>
                        <p className="text-lg text-primary text-center pt-4 h-screen"><a href="/">Return to homepage</a></p>
                    </>
                }
                {
                    !isOwner ?
                    <div className="text-xl text-center mx-auto pt-24 pb-24 pl-10 pr-10">
                        Create your own bookshelf at <a href="/">BookComb.com</a>
                    </div>
                    :
                    <div className="pb-48"></div>

                }
            </div>
            <Analytics />
            </>
            }
        </>
    );
}
