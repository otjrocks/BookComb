
import { nanoid } from 'nanoid';
import EditForm from './EditForm';

export default function EditBookshelf(props) {
    const { isbn, title, subtitle, author, coverImage, year } = props;
    const modal_id = nanoid()
    return (
        <>
        <button className="btn btn-sm btn-success mt-5" onClick={()=>document.getElementById(`add_modal_${modal_id}`).showModal()}>Edit</button>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <dialog id={`add_modal_${modal_id}`} className="modal" checked>
        <div className="modal-box">
            <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-2xl pb-3">Edit Book</h3>
            {/* Add form does an update in the backend so we can use it for edits as well */}
            <EditForm isbn={isbn} title={title} subtitle={subtitle} author={author} coverImage={coverImage} year={year}  />
        </div>
        </dialog>

        </>
    )
}