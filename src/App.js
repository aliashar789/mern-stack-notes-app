import React, { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Alert from './components/Alert';
import NoteState from './context/notes/NoteState';
import Login from './components/Login';
import Signup from './components/Signup';
import AddNote from './components/AddNote';


function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }

  return (
    <NoteState>
      <BrowserRouter>
        <div>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
          <Routes>
            <Route path='/' element={<Home showAlert={showAlert} />} exact />
            <Route path='/addnote' element={<AddNote showAlert={showAlert} />} exact />
            <Route path='/profile' element={<Profile />} exact />
            <Route path='/login' element={<Login showAlert={showAlert} />} exact />
            <Route path='/signup' element={<Signup showAlert={showAlert} />} exact />
          </Routes>
          </div>
        </div>
      </BrowserRouter>
      </NoteState>
  );
}

export default App;