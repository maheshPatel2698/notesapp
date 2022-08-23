import React, { useContext } from 'react'

// importing css
import "../Css/ViewSingleNote.css"

// importing context 
import NotesContext from '../Context/NotesContext'

// importing icons
import { AiFillTag } from "react-icons/ai"

// import image component
import { Image } from 'react-bootstrap'
const ViewSinglenote = () => {

    // getting all data from context
    const { state, navigate } = useContext(NotesContext)
    const { note } = state

    return (
        <div className='vsn'>

            <Image className='i-vsn' loading='lazy' src={note.downloadUrl} alt="" />

            <h1 className='mt-2'>{note.title}</h1>
            <h3><AiFillTag size={28} />  {note?.tag}</h3>
            <div className="para">
                <p className='text-center'>{note.desc}</p>
            </div>
            <button onClick={() => navigate('/notes')} className="btn btn-primary m-2">Back To Notes</button>
        </div>
    )
}

export default ViewSinglenote