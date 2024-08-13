
import { nanoid } from 'nanoid';
import AddForm from './AddForm';

export default function AddBookshelf(props) {
    const { isbn, title, subtitle, author, coverImage, year } = props;
    const modal_id = nanoid()
    return (
        <>
        <button className="btn btn-sm btn-primary mt-5" onClick={()=>document.getElementById(`add_modal_${modal_id}`).showModal()}>Add to Bookshelf</button>
        <dialog id={`add_modal_${modal_id}`} className="modal">
        <div className="modal-box">
            <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-2xl pb-3">Add Book to Bookshelf</h3>
            <AddForm isbn={isbn} title={title} subtitle={subtitle} author={author} coverImage={coverImage} year={year}  />
        </div>
        </dialog>

        </>
    )
}