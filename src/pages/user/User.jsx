import {
  CalendarToday,
  MailOutline,
  PermIdentity,
  Publish,
} from "@material-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./user.css";
import app from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useState } from "react";
import { getOtherCurrentUser, updateUser } from "../../redux/apiCalls";
import { useEffect } from "react";
import LoadingOverlay from "react-loading-overlay";

export default function User() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const otherCurrentUser = useSelector((state) => state.user.otherCurrentUser);

  const [updatedUserInfo, setUpdatedUserInfo] = useState({});
  const [updatedFile, setUpdatedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isActive, setIsActive] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getOtherCurrentUser(dispatch, userId);
  }, [dispatch, userId]);

  const handleChange = (e) => {
    e.preventDefault();
    setUpdatedUserInfo({
      ...updatedUserInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    e.preventDefault();
    setUpdatedFile(e.target.files[0]);
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (
      updatedFile === null ||
      updatedUserInfo.name === "" ||
      updatedUserInfo.email === "" ||
      updatedUserInfo.password === ""
    ) {
      setErrorMsg("Please fill all details");
      setTimeout(() => {
        setErrorMsg("");
      }, 3000);
      return;
    }
    setIsActive(true);

    const updatedFileName = new Date().getTime() + updatedFile.name; //we are giving a unique name to file.name bcoz in future if uploaded file with same name it overwrites it ...so to avoid overwritting of file
    // console.log(fileName);
    const storage = getStorage(app);
    const storageRef = ref(storage, updatedFileName);

    const uploadTask = uploadBytesResumable(storageRef, updatedFile); //file and not fileName bcoz storageRef contains fileName as ref

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
          // console.log("updatedFile available at", downloadURL);
          const updatedUser = {
            ...updatedUserInfo,
            _id: userId,
            image: downloadURL,
          };
          console.log(updatedUser);
          updateUser(userId, updatedUser, dispatch);
          setIsActive(false);
          navigate("/users");
        });
      }
    );
  };

  return (
    <>
      <div className="user">
        <div className="userTitleContainer">
          <h1 className="userTitle">Edit User</h1>
          <Link to="/newUser">
            <button className="userAddButton">Create</button>
          </Link>
        </div>
        <div className="userContainer">
          <div className="userShow">
            <div className="userShowTop">
              <img
                src={otherCurrentUser?.image}
                alt=""
                className="userShowImg"
              />
              <div className="userShowTopTitle">
                <span className="userShowUsername">
                  {otherCurrentUser?.name}
                </span>
                <span className="userShowUserTitle">Software Engineer</span>
              </div>
            </div>
            <div className="userShowBottom">
              <span className="userShowTitle">Account Details</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">
                  {otherCurrentUser?.name}
                </span>
              </div>
              <div className="userShowInfo">
                <CalendarToday className="userShowIcon" />
                <span className="userShowInfoTitle">10.12.1999</span>
              </div>

              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">
                  {otherCurrentUser?.email}
                </span>
              </div>
            </div>
          </div>
          <LoadingOverlay
            active={isActive}
            spinner
            text="Updating a User..."
            style={{ border: "1px solid red" }}
          >
            <div className="userUpdate">
              <span className="userUpdateTitle">Edit</span>
              <form className="userUpdateForm">
                <div className="userUpdateLeft">
                  <div className="userUpdateItem">
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder={otherCurrentUser?.name}
                      className="userUpdateInput"
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder={otherCurrentUser?.name}
                      className="userUpdateInput"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      placeholder={otherCurrentUser?.email}
                      className="userUpdateInput"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="userUpdateItem">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="******"
                      className="userUpdateInput"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="userUpdateRight">
                  <div className="userUpdateUpload">
                    <img
                      className="userUpdateImg"
                      src={otherCurrentUser?.image}
                      alt=""
                    />
                    <label htmlFor="file">
                      <Publish className="userUpdateIcon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleFile}
                    />
                  </div>
                  <button className="userUpdateButton" onClick={handleClick}>
                    Update
                  </button>
                </div>
              </form>
              <p style={{ marginTop: "10px", color: "red" }}>{errorMsg}</p>
            </div>
          </LoadingOverlay>
        </div>
      </div>
    </>
  );
}
