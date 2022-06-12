import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import { getUsers } from "../../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";

export default function WidgetSm() {
  const users = useSelector((state) => state.user.users);
  const newlyJoinedUsers = users.slice(0, 2);
  const dispatch = useDispatch();
  const [querySearch, setQuerySearch] = useState("");

  useEffect(() => {
    getUsers(dispatch, querySearch);
  }, [dispatch, querySearch]);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newlyJoinedUsers.map((user) => (
          <li className="widgetSmListItem" key={user._id}>
            <img
              src={
                user.image ||
                "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
              }
              alt=""
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{user.name}</span>
            </div>
            <button className="widgetSmButton">
              <Visibility className="widgetSmIcon" />
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
