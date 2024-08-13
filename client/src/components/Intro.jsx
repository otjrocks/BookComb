import bookshelf from '../images/bookshelf.png'
import AddForm from './AddForm'
import SearchForm from './SearchForm'

export default function Intro(props) {
    const {handleFormChange, handleFormSubmit} = props
    return (
        <>
        <div className="columns-1 md:columns-2 flex flex-col-reverse lg:flex-row mx-4 sm:mx-16 md:mx-48 justify-center mt-28 mb-16">
            <div className='flex flex-col w-full justify-center lg:pr-36'>
                <h1 className="text-5xl font-bold">Welcome to {import.meta.env.VITE_SITE_NAME}!</h1>
                <p className="py-6">
                    <span className='text-lg'>
                    {import.meta.env.VITE_SITE_NAME} is the easiest way to find information about millions of books. 
                    Comb through book suggestions with our descriptions and ratings. Then share your best book finds with others with the virtual bookshelf. 
                    </span>
                    <br />
                    {/* <div className='pt-3'>
                        <button className='btn btn-primary btn-sm'>About</button>
                    </div> */}
                </p>
                <SearchForm handleFormChange={handleFormChange} handleFormSubmit={handleFormSubmit}/>
                <div className="flex w-full flex-col p-10">
                    <div className="divider">OR</div>
                </div>
                <h2 className="text-3xl font-bold text-primary mb-5">Add a Book Manually</h2>
                <AddForm year={new Date().getFullYear()} />
            </div>
            <div className='mx-auto justify-end w-1/3 lg:w-5/12 pb-8 lg:pb-0'>
                <img src={bookshelf} className='object-contain' />
            </div>
        </div>
        </>
    )
}