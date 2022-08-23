import React, { useContext } from 'react'
// importing naviagte to protect routes
import { Navigate } from 'react-router-dom'

// importing context 
import NotesContext from '../Context/NotesContext'

// importing css
import "../Css/Notes.css"

// importing note component
import Note from "./Note"

const Notes = () => {

    // getting all data from context
    const { user, state } = useContext(NotesContext)

    // destructuring noteItem from state
    const { NoteItem } = state
    if (!user?.email) {
        return <Navigate to="/" />
    }
    else {
        return (
            <div className="notescontainer">
                {
                    NoteItem === null ? <h1>There is No Notes</h1> : Object.entries(NoteItem).map(([key, value]) => {
                        return (
                            <div key={key}>
                                <Note Notekey={key} data={value} />
                            </div>
                        )
                    })
                }
            </div >
        )
    }
}

export default Notes