import React, { useState, useEffect } from 'react';
import './Header.css';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { firebaseConfig } from "../FirebaseConfig";
import { getStorage, ref as REF, uploadBytes, getDownloadURL } from "firebase/storage";






const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const Header = (props) => {
  const [profileHandler, setProfileHandler] = useState(false);
  const [user, setUser] = useState(undefined);
  const [userImg, setUserImg] = useState(undefined);
  const [isUploaded, setIsUploaded] = useState(false);
  

const setProfileImage = () => {
  const fileInput = document.getElementById("upload-image");

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storageRef = REF(storage, `${props.userId}`);
    
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log(snapshot);
      })
      .catch((error) => {
        // Handle upload error
        console.error("Failed to upload image:", error);
      });
  } else {
    // Handle case when no file is selected
    console.error("No file selected.");
                              

}}

  


  const profileFunc = () => {
    setProfileHandler(prevState => !prevState);
  };

  useEffect(() => {
    const userRef = ref(db, 'Users/' + props.userId);
    const userListener = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setUser({
          username: userData.username,
          email: userData.email,
        });
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      userListener();
    };
  }, [db, props.userId]);


 

  const onclickFunc = async () => {
    await setProfileImage();
  
    getDownloadURL(REF(storage, `${props.userId}`))
      .then((url) => {
       
        setUserImg(url);
        setIsUploaded(true);
  
        update(ref(db, 'Users/' + props.userId), {
          photoURL: userImg,
        });
      })
      .catch((error) => {
        // Handle any errors
      });
  };
  



  return (
    <div>
      <div className={`profile-overlay ${profileHandler ? 'visible' : 'unvisible'}`}>
        <div className={`profile-wrapper ${profileHandler ? 'visible' : 'unvisible'}`}>
          <div className="profile-button" onClick={profileFunc}></div>
          <div className="profile">
                {user && (
                  <>
                    <div className="container-wrapper">
                      <div className="frst">
                    <div className="profile-container">
                    <div className="user-photo"></div>
                    <div className='data-wrapper'>
                    <div className="username-profile">{user.username}</div>
                    <div className='online-profile'>Online</div></div>
                  </div>
                  <span className='email-label'>Email</span>
                  <div className="email">{user.email}</div>
                  </div>
                  <div className="scnd">
                  <span className='set-span'>Set Profile Image</span> 
                  <div className='set-img'>
                  <input type="file" id='upload-image' className='custom-file-input'/>
                  <button onClick={onclickFunc} className='upload-btn'>{!isUploaded ? "Upload image" : "Uploaded"}</button>
                  </div>
                  </div>
                  </div>
                  </>
                )}
          </div>

        </div>
      </div>
      <div className="header">
        <div className="left">persprojchat</div>
        <button className="right" onClick={profileFunc}>
          PROFILE
        </button>
      </div>
    </div>
  );
};

export default Header;
