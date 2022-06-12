import { useState } from "react";
import app from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import "./newUser.css";
import { addUser } from "../../redux/apiCalls";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

export default function NewUser() {
  const [userInfo, setUserInfo] = useState({});
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();

    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (
      file === null ||
      userInfo.name === "" ||
      userInfo.email === "" ||
      userInfo.password === ""
    ) {
      setErrorMsg("Please fill all details");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    setIsActive(true);
    const fileName = new Date().getTime() + file.name; //we are giving a unique name to file.name bcoz in future if uploaded file with same name it overwrites it ...so to avoid overwritting of file
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file); //file and not fileName bcoz storageRef contains fileName as ref

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log("error: ", error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);

          const user = {
            ...userInfo,
            image: downloadURL,
          };
          addUser(user, dispatch);
          setIsActive(false);
          navigate("/users");
        });
      }
    );
  };

  return (
    <>
      <div className="newUser">
        <h1 className="newUserTitle">New User</h1>
        <form className="newUserForm">
          <LoadingOverlay
            active={isActive}
            spinner
            text="Adding New User..."
            style={{ padding: "0" }}
          >
            <div className="newUserItem">
              <label>Image</label>
              <input type="file" id="file" onChange={handleFile} />
            </div>

            <div className="newUserItem">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Smith"
                onChange={handleChange}
              />
            </div>
            <div className="newUserItem">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@gmail.com"
                onChange={handleChange}
              />
            </div>
            <div className="newUserItem">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                onChange={handleChange}
              />
            </div>

            <button className="newUserButton" onClick={handleClick}>
              Create
            </button>
            <p style={{ marginTop: "10px", color: "red" }}>{errorMsg}</p>
          </LoadingOverlay>
        </form>
      </div>
    </>
  );
}
