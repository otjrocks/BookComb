import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditForm(props) {
    const { isbn, title, subtitle, author, coverImage, year } = props;
    const navigate = useNavigate();

    function redirectLogin() {
        navigate("/login");
    }


    const [formData, setFormData] = useState({
        isbn: isbn,
        title: title,
        subtitle: subtitle,
        author: author,
        coverImage: coverImage,
        year: year
    });
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData({ 
            ...formData, 
            [name]: value
        });
    };

    function handleEditBookshelf(user) {
        // First, remove the existing entry from the bookshelf
        let removeUrl = `${import.meta.env.VITE_API_URL}/bookshelfs/remove/${formData.isbn}`;
        fetch(removeUrl, {
            method: "POST",
            credentials: "include"
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to remove old bookshelf entry");
            }
            // Proceed to add the new entry if the removal was successful
            let addUrl = `${import.meta.env.VITE_API_URL}/bookshelfs/add/${formData.isbn}/${formData.year}`;
            return fetch(addUrl, {
                method: "POST",
                credentials: "include"
            });
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to add new bookshelf entry");
            }
            // Add the book to the database
            let bookRequest = new Request(`${import.meta.env.VITE_API_URL}/books/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    isbn: formData.isbn,
                    title: formData.title,
                    subtitle: formData.subtitle,
                    author: formData.author,
                    coverImage: formData.coverImage
                })
            });
            return fetch(bookRequest);
        })
        .then(res => res.json())
        .then(res => {
            if (!res.success) {
                throw new Error("Unable to add book to database");
            }
            console.log("Successfully added book to database");
            setIsLoading(false);
            window.location.reload()
        })
        .catch(err => {
            alert("Unable to modify bookshelf. Please try again.");
            console.error(err);
            setIsLoading(false);
        });
    }

    function handleSubmit(event) {
        setIsLoading(true);
        event.preventDefault();
        // Fetch user information to check if authenticated
        fetch(`${import.meta.env.VITE_API_URL}/users/info`, {
            method: "GET",
            credentials: "include"
        })
        .then(res => res.json())
        .then(user => {
            if (!user.authenticated) {
                redirectLogin();
            } else {
                handleEditBookshelf(user);
            }
        })
        .catch(err => {
            console.error("Failed to fetch user info", err);
            setIsLoading(false);
        });
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-base-200 rounded-lg shadow-lg">
            <div className="form-control mb-4">
                <label htmlFor="isbn" className="label">
                    <span className="label-text">ISBN:</span>
                </label>
                <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    className="input input-bordered w-full"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-control mb-4">
                <label htmlFor="title" className="label">
                    <span className="label-text">Title:</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="input input-bordered w-full"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-control mb-4">
                <label htmlFor="subtitle" className="label">
                    <span className="label-text">Subtitle:</span>
                </label>
                <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    className="input input-bordered w-full"
                    value={formData.subtitle}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control mb-4">
                <label htmlFor="author" className="label">
                    <span className="label-text">Author:</span>
                </label>
                <input
                    type="text"
                    id="author"
                    name="author"
                    className="input input-bordered w-full"
                    value={formData.author}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control mb-4">
                <label htmlFor="coverImage" className="label">
                    <span className="label-text">Cover Image URL:</span>
                </label>
                <input
                    type="text"
                    id="coverImage"
                    name="coverImage"
                    className="input input-bordered w-full"
                    value={formData.coverImage}
                    onChange={handleChange}
                />
            </div>
            <div className="form-control mb-4 items-center">
                <img
                    src={formData.coverImage}
                    alt="Cover Image"
                    className="w-1/3"
                />
            </div>
            <div className="form-control mb-4">
                <label htmlFor="year" className="label">
                    <span className="label-text">Year:</span>
                </label>
                <input
                    type="number" 
                    min="1900" 
                    max="2300" 
                    step="1"
                    id="year"
                    name="year"
                    className="input input-bordered w-full"
                    value={formData.year}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary btn-wide" disabled={isLoading}>
            {isLoading
            ?
            <span className="loading loading-dots loading-md"></span>
            :
            <>Submit</>
            }
            </button>
        </form>
    );
}