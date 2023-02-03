import { useEffect, useState, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { notification } from "antd";

import "./editSocial.css";
import { getSocialById, updateSocialById } from "../../api/social";

export default function EditSocial() {
  const [api, contextHolder] = notification.useNotification();

  const { socialId } = useParams();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const openNotificationWithIcon = useCallback(
    (type, description) => {
      api[type]({
        message: "Notification",
        description,
      });
    },
    [api]
  );

  const handleUpdateSocial = async () => {
    try {
      await updateSocialById(socialId, {
        title,
        url,
      });
      openNotificationWithIcon("success", "Update Social Successfully");

      history.push("/social");
    } catch (error) {
      openNotificationWithIcon("error", "Update Social Fauilure");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSocialById(socialId);

        if (res.status === 200) {
          setTitle(res.data.title);
          setUrl(res.data.url);
        }
      } catch (error) {
        openNotificationWithIcon("error", "Fetch Data Error");
      }
    };
    fetchData();
  }, [socialId, openNotificationWithIcon]);

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Social</h1>
        <Link to="/newSocial">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userUpdate">
          <div className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Hệ quản trị cơ sở dữ liệu - Buổi số 1"
                  className="userUpdateInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Url</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=WMqFM8cWj2U"
                  className="userUpdateInput"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button className="userUpdateButton" onClick={handleUpdateSocial}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
