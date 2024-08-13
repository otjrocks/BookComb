import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddForm(props) {
    const { isbn, title, subtitle, author, coverImage, year } = props;
    const navigate = useNavigate()

    function redirectLogin() {
        navigate("/login")
    }

    const [formData, setFormData] = useState({
        isbn: isbn,
        title: title,
        subtitle: subtitle,
        author: author,
        coverImage: coverImage,
        year: year
      });
      const [isLoading, setIsLoading] = useState(false)
    
      function handleChange(event) {
        event.preventDefault()
        const { name, value } = event.target;
        setFormData({ 
            ...formData, 
            [name]: value
        });
      };

      function handleAddBookshelf(event) {
        event.preventDefault()
    
        let request = new Request(`${import.meta.env.VITE_API_URL}/users/info`, {
            method: "GET",
            credentials: "include",
        });
        fetch(request)
            .then(
                res => res.json()
            ).then(
                user => {
                    if (!user.authenticated) {
                        redirectLogin()
                    } else {
                        let url = `${import.meta.env.VITE_API_URL}/bookshelfs/add/`
                        url = url + formData.isbn // add isbn13 to query string
                        url = url + `/${formData.year}` // add year to query string
                        request = new Request(url, {
                            method: "POST",
                            credentials: "include",
                        });
                        fetch(request)
                            .then(
                                res => res.json()
                            ).then(() => { 
                                let book_request = new Request(`${import.meta.env.VITE_API_URL}/books/add`, {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({isbn: formData.isbn, title: formData.title, subtitle: formData.subtitle, author: formData.author, coverImage: formData.coverImage})
                                });
                                fetch(book_request)
                                    .then(res => res.json())
                                    .then(res => {
                                        if (!res.success) {
                                            alert("Unable to add book. Please try again.")
                                            console.log(err)
                                            setIsLoading(false);
                                        } else {
                                            console.log("added book to db")
                                            // successfully added everything, return bookshelf
                                            navigate(`/account`)
                                            setIsLoading(false);
                                        }
                                    })
                                    .catch(err => {
                                        err => {
                                            alert("Unable to add book. Please try again.")
                                            console.log(err)
                                            setIsLoading(false);
                                          }
                                    })
                                }
                            ).catch(
                                err => {
                                  alert("Unable to add book. Please try again.")
                                  console.log(err)
                                  setIsLoading(false);
                                }
                            )
                    }
                }
            ).catch(
                err => {
                  console.log(err)
                  setIsLoading(false);
                }
                
            )
    }
    
      function handleSubmit(event) {
        setIsLoading(true);
        event.preventDefault();
        handleAddBookshelf(event);
      };
      

      return (
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label htmlFor="isbn" className="label">
              <span className="label-text text-lg">ISBN:</span>
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
              <span className="label-text text-lg">Title:</span>
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
              <span className="label-text text-lg">Subtitle:</span>
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
              <span className="label-text text-lg">Author:</span>
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
              <span className="label-text text-lg">Cover Image URL:</span>
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
                    <span className="label-text text-lg">Year:</span>
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