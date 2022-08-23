import React, { useContext } from 'react'
// importing css
import "../Css/Home.css"

// importing icons
import { AiFillDelete } from "react-icons/ai"
import { FaPen } from "react-icons/fa"


// importing notesContext
import NotesContext from '../Context/NotesContext'

const Home = () => {
    // getting state from context
    const { darkMode } = useContext(NotesContext)
    return (
        <div style={darkMode} className='container'>
            <ol>
                <h2 className='text-center'>Steps How to Add Note</h2>
                <li>Click on <b>Log In</b>  to login on your Account</li>
                <li> To Add Note <b>Add Notes</b> </li>
                <li> To View All Your Notes <b>Notes</b>  </li>
                <li>To Update Note Click On <FaPen size={23} />  </li>
                <li>To Delete Note <AiFillDelete size={25} /> </li>
            </ol>
        </div>
    )
}

export default Home