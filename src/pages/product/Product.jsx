import { Link, useLocation, useNavigate } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import app from "../../firebase";
import LoadingOverlay from "react-loading-overlay";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getCurrentProduct, updateProducts } from "../../redux/apiCalls";

export default function Product() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const productId = location.pathname.split("/")[2];

  const [productStats, setProductStats] = useState([]);

  const currentProduct = useSelector((state) => state.product.currentProduct);

  useEffect(() => {
    getCurrentProduct(dispatch, productId);
  }, [dispatch, productId]);

  const [updatedProductInfo, setUpdatedProductInfo] = useState({});
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [updatedSize, setUpdatedSize] = useState([]);
  const [updatedColor, setUpdatedColor] = useState([]);
  const [updatedFile, setUpdatedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setUpdatedProductInfo({
      ...updatedProductInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategories = (e) => {
    e.preventDefault();
    setUpdatedCategories(e.target.value.split(","));
  };
  const handleSize = (e) => {
    e.preventDefault();
    setUpdatedSize(e.target.value.split(","));
  };
  const handleColor = (e) => {
    e.preventDefault();
    setUpdatedColor(e.target.value.split(","));
  };

  const handleFile = (e) => {
    e.preventDefault();
    setUpdatedFile(e.target.files[0]);
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (
      updatedFile === null ||
      updatedProductInfo.name === "" ||
      updatedProductInfo.description === "" ||
      updatedProductInfo.price === "" ||
      updatedCategories.length === 0 ||
      updatedSize.length === 0 ||
      updatedColor.length === 0
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
          const updatedProduct = {
            ...updatedProductInfo,
            _id: productId,
            categories: updatedCategories,
            color: updatedColor,
            size: updatedSize,
            image: downloadURL,
          };
          updateProducts(productId, updatedProduct, dispatch);
          setIsActive(false);
          navigate("/products");
        });
      }
    );
  };

  return (
    <>
      <div className="product">
        <div className="productTitleContainer">
          <h1 className="productTitle">Product</h1>
          <Link to="/newproduct">
            <button className="productAddButton">Create</button>
          </Link>
        </div>
        <LoadingOverlay
          active={isActive}
          spinner
          text="Updating a Product..."
          style={{ width: "80%" }}
        >
          <div className="productTop">
            <div className="productTopLeft">
              <Chart
                data={productStats}
                dataKey="Sales" //key=Sales ...line 54
                title="Sales Performance"
              />
            </div>
            <div className="productTopRight">
              <div className="productInfoTop">
                <img
                  src={currentProduct.image}
                  alt="img"
                  className="productInfoImg"
                />

                <span className="productName">{currentProduct.title}</span>
              </div>
              <div className="productInfoBottom">
                <div className="productInfoItem">
                  <span className="productInfoKey">id:</span>
                  <span className="productInfoValue">{currentProduct._id}</span>
                </div>
                <div className="productInfoItem">
                  <span className="productInfoKey">sales:</span>
                  <span className="productInfoValue">5123</span>
                </div>
                <div className="productInfoItem">
                  <span className="productInfoKey">active:</span>
                  <span className="productInfoValue">yes</span>
                </div>
                <div className="productInfoItem">
                  <span className="productInfoKey">in stock:</span>
                  <span className="productInfoValue">
                    {currentProduct.inStock && "yes"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="productBottom">
            <form className="productForm">
              <div className="productFormLeft">
                <label>Product Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder={currentProduct.title}
                  onChange={handleChange}
                />
                <label>Product Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder={currentProduct.description}
                  onChange={handleChange}
                />

                <label>Categories</label>
                <input
                  type="text"
                  name="categories"
                  placeholder={currentProduct.categories}
                  onChange={handleCategories}
                />

                <label>Size</label>
                <input
                  type="text"
                  name="size"
                  placeholder={currentProduct.size}
                  onChange={handleSize}
                />

                <label>Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder={currentProduct.color}
                  onChange={handleColor}
                />

                <label>Product Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder={currentProduct.price}
                  onChange={handleChange}
                />

                <label>In Stock</label>
                <select name="inStock" id="idStock">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <label>Active</label>
                <select name="active" id="active">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="productFormRight">
                <div className="productUpload">
                  <img
                    src={currentProduct.image}
                    alt="img"
                    className="productUploadImg"
                  />

                  <label for="file">
                    <Publish className="productUpdateIcon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                </div>
                <button className="productButton" onClick={handleClick}>
                  Update
                </button>
              </div>
            </form>
            <p style={{ marginTop: "10px", color: "red" }}>{errorMsg}</p>
          </div>
        </LoadingOverlay>
      </div>
    </>
  );
}
