import "./userList.css";

import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../../redux/apiCalls";

export default function UserList() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    getUsers(dispatch, querySearch);
  }, [dispatch, querySearch]);

  const handleDelete = (id) => {
    // setData(data.filter((item) => item.id !== id));
    deleteUser(id, dispatch);
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 }, //_id and not id bcoz in db we have _id
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.image} alt="" />
            {params.row.name}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row._id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  const handleSearch = (e) => {
    setQuerySearch(e.target.value);
  };
  return (
    <div className="userList">
      <form style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search.."
          name="search"
          onChange={handleSearch}
          style={{ width: "200px", height: "20px" }}
        />
      </form>
      <DataGrid
        // rows={data}
        rows={users}
        getRowId={(row) => row._id}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
