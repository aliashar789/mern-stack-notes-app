import React, {useEffect, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import noteContext from "../context/notes/noteContext"

const Profile = () => { 
    const [updateUser, setUpdateUser] = useState({});
    const context = useContext(noteContext);
    let navigate = useNavigate();
    const { getUserInfo, userInfo, updateUserInfo } = context;

    useEffect(() => {
        if(localStorage.getItem('token')){
            getUserInfo()
        } else {
          navigate("/login")
        }
        // eslint-disable-next-line
    }, [])

    const handleChange = (e, key) => {
        const { value, files } = e.target;
      
        if (files && files.length > 0) {
            setUpdateUser((prevForm) => ({
            ...prevForm,
            [key]: URL.createObjectURL(files[0]),
          }));
        } else {
            setUpdateUser((prevForm) => ({
            ...prevForm,
            [key]: value,
          }));
        }
      };

      const handleClick = async (e) => {
        e.preventDefault();
        await updateUserInfo({name: updateUser.name, avatar: updateUser.avatar});
        setUpdateUser({});
      };

    return (
        <div>
      <h2>Update Profile</h2>
      {updateUser.avatar ? (
        <img src={updateUser.avatar} width="100" height="100" alt="User Avatar" />
      ) : (
      <img src={userInfo.avatar} width="100" height="100" alt="User Avatar" />
      )}
      <form >
      <div>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={(e) => handleChange(e, 'avatar')}
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={updateUser.name || userInfo.name || ''}
            onChange={(e) => handleChange(e, 'name')}
          />
        </div>
        <div>
          <button onClick={handleClick} type="submit">Save Changes</button>
        </div>
      </form>
    </div>
    )
}

export default Profile