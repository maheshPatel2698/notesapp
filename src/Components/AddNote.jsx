import React, { useState, useContext, useEffect } from 'react'
// importing css 
import "../Css/AddNote.css"

// importing firebase
import firebase from "firebase/compat/app"
import "firebase/compat/database"
import "firebase/compat/storage"

// importing imageconfig
import imageConfig from '../Utils/imageConfig'

// importing notes context
import NotesCotext from '../Context/NotesContext'

// importing uuid to provide random id
import { v4 } from 'uuid'

// importing toast to provide toast messages
import { toast } from 'react-toastify'

// importing naviagate to proect route
import { Navigate } from 'react-router-dom'

// importing actions 
import { UPDATE_IMAGE, UPDATE_NOTE } from '../Reducer/action.type'

// importing image component from react-bootstrap
import { Image } from 'react-bootstrap'

// importing image resizer to resize iamge
import { readAndCompressImage } from "browser-image-resizer/src/index"

// importing spinner to show spinner component
import Spinner from "react-bootstrap/Spinner"

const AddNote = () => {

    // getting all the data 
    const { dbref, user, state, isUpdate, setIsUpdate, dispatch, navigate, darkMode } = useContext(NotesCotext)

    // destructuring from satte
    const { NoteToUpdateKey, NoteToUpdate, ImageToUpdateKey } = state

    // creting state for input
    const [title, setTitle] = useState("")
    const [desc, setDescription] = useState("")
    const [tag, setTag] = useState("")
    const [date, setDate] = useState("")
    const [downloadUrl, setDownloadUrl] = useState("")
    const [imageName, setImageName] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    // image picker
    const imagePicker = async (e) => {
        setIsUploading(true)
        try {
            const file = e.target.files[0]
            var metadata = {
                file: file.name
            }
            var resizedImage = await readAndCompressImage(file, imageConfig)
            if (isUpdate) {
                const prevRef = firebase.storage().ref(dbref).child('images/' + ImageToUpdateKey)
                await prevRef.put(resizedImage, metadata)
                await prevRef.getDownloadURL()
                    .then((res) => {
                        setDownloadUrl(res)
                        toast.success("Image Uploaded",
                            { autoClose: 500, position: "top-right", closeButton: false }
                        )
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                const imgName = prevRef.name
                setImageName(imgName)
                setIsUploading(false)

            }
            else {
                const storageRef = firebase.storage().ref(dbref).child('images/' + v4())
                await storageRef.put(resizedImage, metadata)
                await storageRef.getDownloadURL()
                    .then((res) => {
                        setDownloadUrl(res)
                        toast.success("Image Uploaded",
                            {
                                autoClose: 500,
                                position: "top-right",
                                closeButton: false
                            }
                        )
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                const imgName = storageRef.name
                setImageName(imgName)
                setIsUploading(false)
            }
        } catch (error) {
            console.log(error)
            toast.error("Oops something went wrong",
                {
                    autoClose: 500,
                    closeButton: false,
                    closeOnClick: true,
                    position: "top-right"
                })
            setIsUploading(false)
        }
    }

    // creting notes under ref of user name   
    const addNotes = () => {
        if (!title || !desc || !tag || !downloadUrl || !imageName) {
            return toast.warning("Please fill all fields",
                {
                    autoClose: 800,
                    position: "top-right",
                    closeButton: false
                })
        }
        try {
            firebase.database().ref(dbref).child('Notes/' + v4())
                .set({
                    title,
                    desc,
                    tag,
                    date,
                    downloadUrl,
                    imageName

                })
            toast.success("Notes Added",
                {
                    autoClose: 900,
                    position: "top-right",
                    closeButton: false
                })
            setTitle("")
            setDescription("")
            setTag("")
            setDate("")
            setDownloadUrl("")
            navigate('/notes')
        } catch (error) {
            toast.error(error, { autoClose: 500, position: "top-right" })
        }
    }

    // using useEffect to set input fields to according to data available
    useEffect(() => {
        if (NoteToUpdate) {
            setTitle(NoteToUpdate.title)
            setDescription(NoteToUpdate.desc)
            setTag(NoteToUpdate.tag)
            setDate(NoteToUpdate.date)
            setDownloadUrl(NoteToUpdate.downloadUrl)
            setImageName(NoteToUpdate.imageName)
        }
    }, [NoteToUpdate])

    // method to updateNote
    const updateNote = () => {
        firebase.database().ref(dbref).child('Notes/' + NoteToUpdateKey)
            .set({
                title,
                desc,
                tag,
                date,
                downloadUrl,
                imageName
            })

        navigate('/notes')
        setIsUpdate(false)
        dispatch({
            type: UPDATE_NOTE,
            payload: null,
            key: null
        })
        dispatch({
            type: UPDATE_IMAGE,
            key: null
        })
        toast.success("Note Updated", {
            autoClose: 500,
            position: "top-right",
            closeButton: false
        })

    }
    const handleSubmit = (e) => {
        e.preventDefault()
        isUpdate ? updateNote() : addNotes()
    }
    if (!user?.email) {
        return <Navigate to='/' />
    }
    else {
        return (
            <div className='main-container'>
                <form style={darkMode} id='form' onSubmit={handleSubmit} >
                    <label htmlFor="image">Upload Image Here</label>
                    {isUploading ? <Spinner className="m-2" animation="border" variant="primary" /> : null}
                    <div>
                        <Image loading='lazy' src={downloadUrl} roundedCircle className='i' />
                    </div>
                    <input
                        type="file"
                        onChange={imagePicker}
                    />

                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder='Type your notes title Here'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <label htmlFor="desc">Description</label>
                    <textarea
                        type="text"
                        name="desc"
                        id="desc"
                        placeholder='Type your notes description here'
                        value={desc}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="tag">Tag</label>
                    <input
                        type="text"
                        name="tag"
                        id="tag"
                        placeholder='Type your tag here'
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />
                    <label htmlFor="date">Date</label>
                    <input type="date"
                        name='date'
                        id='date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}

                    />
                    <button type='submit' className='btn btn-primary m-2'>{isUpdate ? "Update Note" : "Add Note"}</button>
                </form>
            </div>
        )
    }

}

export default AddNote