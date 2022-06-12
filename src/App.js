import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import WalletCard from "./pages/walletCard/WalletCard";

function App() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const admin = useSelector((state) => state.user.currentUser?.isAdmin);

  return (
    <div>
      {currentUser === null ? (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          </Router>
        </>
      ) : (
        <>
          <Router>
            <Topbar />
            <div className="container">
              <Sidebar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/user/:userId" element={<User />} />
                <Route path="/newUser" element={<NewUser />} />

                <Route path="/products" element={<ProductList />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/newproduct" element={<NewProduct />} />
                <Route path="/wallet" element={<WalletCard />} />
              </Routes>
            </div>
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
