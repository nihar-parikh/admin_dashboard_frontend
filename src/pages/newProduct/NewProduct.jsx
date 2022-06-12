import { useState, useEffect } from "react";
import "./newProduct.css";
import app from "../../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { addProducts, getProducts } from "../../redux/apiCalls";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

export default function NewProduct() {
  const [productInfo, setProductInfo] = useState({});
  const [categories, setCategories] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  const handleChange = (e) => {
    e.preventDefault();
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const handleCategories = (e) => {
    e.preventDefault();
    setCategories(e.target.value.split(","));
  };
  const handleSize = (e) => {
    e.preventDefault();
    setSize(e.target.value.split(","));
  };
  const handleColor = (e) => {
    e.preventDefault();
    setColor(e.target.value.split(","));
  };

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (
      file === null ||
      productInfo.name === "" ||
      productInfo.description === "" ||
      productInfo.price === "" ||
      categories.length === 0 ||
      size.length === 0 ||
      color.length === 0
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
          // console.log("File available at", downloadURL);

          const product = {
            ...productInfo,
            categories,
            color,
            size,
            image: downloadURL,
          };
          addProducts(product, dispatch);
          setIsActive(true);
          navigate("/products");
        });
      }
    );
  };

  return (
    <>
      <div className="newProduct">
        <h1 className="addProductTitle">New Product</h1>
        <form className="addProductForm">
          <LoadingOverlay
            active={isActive}
            spinner
            text="Adding New Product..."
            style={{ padding: "0" }}
          >
            <div className="addProductItem">
              <label>Image</label>
              <input type="file" id="file" onChange={handleFile} />
            </div>

            <div className="addProductItem">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Apple Airpods"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Categories</label>
              <input
                type="text"
                name="categories"
                placeholder="shoes,male"
                onChange={handleCategories}
              />
            </div>
            <div className="addProductItem">
              <label>Size</label>
              <input
                type="text"
                name="size"
                placeholder="S,M,L"
                onChange={handleSize}
              />
            </div>
            <div className="addProductItem">
              <label>Color</label>
              <input
                type="text"
                name="color"
                placeholder="Red,Blue,Black"
                onChange={handleColor}
              />
            </div>

            <div className="addProductItem">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="2000"
                onChange={handleChange}
              />
            </div>
            <div className="addProductItem">
              <label>Stock</label>
              <select>
                <option value="true">yes</option>
                <option value="false">no</option>
              </select>
            </div>

            <p style={{ marginTop: "10px", color: "red" }}>{errorMsg}</p>

            <button className="addProductButton" onClick={handleClick}>
              Create
            </button>
          </LoadingOverlay>
        </form>
      </div>
    </>
  );
}
