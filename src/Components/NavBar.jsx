import React, { useContext } from 'react'
import '../Css/NavBar.css'

// importing icons from react-icons
import { FaRegLightbulb, FaUser } from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"

// importing context
import NotesContext from "../Context/NotesContext"
import { Image } from 'react-bootstrap'

const NavBar = () => {
    // getting all the data and methods from context
    const { handleLogin, user, handleLogOut, navigate, darkMode, handleDarkMode } = useContext(NotesContext)

    const handleAction = () => {
        user?.email ? handleLogOut() : handleLogin()
    }

    // method to provide effect to user card
    const handleUsercard = () => {
        const element = document.getElementById('userCard')
        element.classList.toggle('userCardTransition')
    }


    return (

        <nav style={darkMode} className="navbar navbar-expand-lg ">
            <span onClick={() => navigate('/')} className="navbar-brand">Notes App</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"><GiHamburgerMenu size={25} /></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <span onClick={() => navigate('/notes')} className="nav-item  active" >Notes<span className="sr-only">(current)</span></span>
                    <span onClick={() => navigate('/addnote')} className="nav-item  active" >Add Note<span className="sr-only">(current)</span></span>
                    <span className="nav-item" > <span onClick={handleAction}>{user?.email ? "Log out" : "Log In"}</span> </span>
                    <span className="nav-item " > {user?.email ? <Image loading='lazy' onClick={handleUsercard} className='i' fluid src={user?.photo} roundedCircle /> : <FaUser size={25} />} </span>
                    <span className='nav-item '><FaRegLightbulb onClick={handleDarkMode} size={32} /></span>

                </div>
            </div>
        </nav>
    )
}

export default NavBar