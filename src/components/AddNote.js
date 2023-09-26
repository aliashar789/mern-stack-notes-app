import React, {useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from "../context/notes/noteContext"

const AddNote = (props) => {
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const {addNote} = context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})

    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate("/login")
        } 
        // eslint-disable-next-line
    }, [])

    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setNote({title: "", description: "", tag: ""});
        props.showAlert("added successfully", "success");
        navigate("/")
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={3} required /> 
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} required />
                </div>
               
                <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote