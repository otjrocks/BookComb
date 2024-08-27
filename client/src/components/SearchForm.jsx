export default function SearchForm(props) {
    const {handleFormChange, handleFormSubmit, searchFormData} = props
    return (
        <>
        <div className="search--container container">
            <h2 className="text-3xl font-bold text-primary mb-5">Add a Book by Search</h2>
            <div>
                <label className="search--form--item text-lg">
                    <span className="font-bold">Search for a book:</span>
                    <input type="text" onChange={handleFormChange} name="search_text" value={searchFormData.search_text} className="input input-bordered flex items-center gap-4 grow w-full mx-auto" />
                    <i className="text-sm">Search by a book's title, a description, a quote, or ISBN.</i>
                </label>
                <div className="search--form--item flex flex-col pt-4">
                    <div className="mr-5">
                        <p className="text-lg pb-2 font-bold">Search by:</p>
                        <label className="search--type--toggle text-primary">
                        ISBN
                        <input type="checkbox" onChange={handleFormChange} name="search_type" className="toggle toggle-lg toggle-primary ml-4 mr-2" checked={searchFormData.search_type === "text"} />
                        Text
                        </label>
                    </div>
                    <div className="pt-4">
                        <button onClick={handleFormSubmit} className="btn btn-wide btn-md btn-primary">Search</button>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
} 