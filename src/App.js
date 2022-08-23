import React, { useState, useReducer, useEffect } from 'react'
// imorting css
import "./Css/App.css"

// importing components
import Notes from "./Components/Notes"
import ViewSingleNote from "./Components/ViewSingleNote"
import Home from './Components/Home'
import NavBar from './Components/NavBar'
import AddNote from './Components/AddNote'

// importing react toast
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

// importing bootstrap
import "bootstrap/dist/css/bootstrap.min.css"

// importing react-router-dom
import { Routes, Route, useNavigate } from "react-router-dom"

// importing notescontext
import NotesCotext from './Context/NotesContext'

// importing method
import { SET_NOTES } from "./Reducer/action.type"
// importing notes reducer

// importing notesreducer
import NotesReducer from './Reducer/NoteReducer'

// importing firebase 
import firebase from "firebase/compat/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import firebaseConfig from "./Config/firebaseconfig"
import "firebase/compat/database"

const App = () => {
  // getting navigate to another page
  let navigate = useNavigate()

  // Method to check prev user
  const checkPrevUser = () => {
    const user = localStorage.getItem('user')
    if (user) {
      return JSON.parse(user)
    }
    else {
      return null
    }
  }

  // creating state for user
  const [user, setUser] = useState(checkPrevUser())

  const checkPrevref = () => {
    const prevRef = localStorage.getItem('ref')
    if (prevRef) {
      return prevRef
    }
    else {
      return null
    }
  }
  // creating state for db ref
  const [dbref, setDbref] = useState(checkPrevref())

  // creating state for update
  const [isUpdate, setIsUpdate] = useState(false)

  // initializing state for reducer
  const initailState = {
    NoteItem: [],
    note: {},
    NoteToUpdate: null,
    NoteToUpdateKey: null,
    ImageToUpdateKey: null
  }

  // creating reducer for initial state
  const [state, dispatch] = useReducer(NotesReducer, initailState)

  // state for darkmode
  const [darkMode, setDarkMode] = useState({})

  // checking dark mode is unable of not
  const [isDark, setIsDark] = useState(true)

  // creating method to handle login
  const app = firebase.initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  // creating to method to handle Login
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const userData = {
          name: res.user.displayName,
          uid: res.user.uid,
          email: res.user.email,
          varifiedEmail: res.user.emailVerified,
          photo: res.user.photoURL,
          lastlogin: res.user.metadata.lastSignInTime
        }
        setUser(userData)
        const ref = res.user.displayName
        setDbref(ref)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('ref', JSON.stringify(ref))
        toast.success('Login Successfull',
          {
            autoClose: 500,
            position: "top-right",
            closeButton: false
          })
      }).catch((error) => {
        console.log(error)
      })
  }
  const handleLogOut = () => {
    signOut(auth)
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('ref')
    toast.success('Logout Successfull',
      {
        autoClose: 500,
        position: "top-right",
        closeButton: false
      })
  }

  // creting method to handle Dark mode
  const handleDarkMode = () => {
    if (isDark) {
      setDarkMode({
        transition: "all 0.7s ease",
        backgroundColor: "#BB86FC",
        color: "#2F2519",

      })
      setIsDark(false)
      const bodyEle = document.getElementById('body')
      bodyEle.classList.add('bodyDarkMode')
    }
    else {
      setDarkMode({
        transition: "all 0.7s ease",
      })
      setIsDark(true)
      const bodyEle = document.getElementById('body')
      bodyEle.classList.remove('bodyDarkMode')

    }
  }

  // getting all notes from firebase realtime database
  const getAllNotes = () => {
    try {
      firebase.database().ref(dbref).child('Notes')
        .on('value', snapshot => {
          dispatch({
            type: SET_NOTES,
            payload: snapshot.val()
          })
        })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (dbref === null) {
      return;
    }
    else {
      getAllNotes()
    }
  }, [dbref])


  return (
    <div >
      <NotesCotext.Provider
        value={{
          user,
          setUser,
          state,
          dispatch,
          handleLogin,
          handleLogOut,
          dbref,
          isUpdate,
          setIsUpdate,
          navigate,
          darkMode,
          handleDarkMode
        }}
      >

        <NavBar />
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/notes' element={<Notes />} />
          <Route path='/note' element={<ViewSingleNote />} />
          <Route path='addnote' element={<AddNote />} />
          <Route path='/notes' element={<Notes />} />
        </Routes>
      </NotesCotext.Provider>
    </div>

  )
}

export default App