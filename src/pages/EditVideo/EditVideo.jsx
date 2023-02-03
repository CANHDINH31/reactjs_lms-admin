import { useEffect, useState, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { notification } from "antd";

import "./editVideo.css";
import { getVideoById, updateVideoById } from "../../api/video";

export default function EditVideo() {
  const [api, contextHolder] = notification.useNotification();

  const { videoId } = useParams();
  const history = useHistory();

  const [index, setIndex] = useState(1);
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
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

  const handleUpdateVideo = async () => {
    try {
      await updateVideoById(videoId, {
        index,
        title,
        product,
        url,
      });
      openNotificationWithIcon("success", "Update Video Successfully");

      history.push("/video");
    } catch (error) {
      openNotificationWithIcon("error", "Update Video Fauilure");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVideoById(videoId);

        if (res.status === 200) {
          setTitle(res.data.title);
          setIndex(res.data.index);
          setUrl(res.data.url);
          setProduct(res.data.product);
        }
      } catch (error) {
        openNotificationWithIcon("error", "Fetch Data Error");
      }
    };
    fetchData();
  }, [videoId, openNotificationWithIcon]);

  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Video</h1>
        <Link to="/newVideo">
          <button className="userAddButton">Create</button>
        </Link>
      </div>
      <div className="userContainer">
        <div className="userUpdate">
          <div className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Index</label>
                <input
                  type="number"
                  placeholder="1"
                  className="userUpdateInput"
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                />
              </div>
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
            </div>
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Product</label>
                <textarea
                  rows={8}
                  onChange={(e) => setProduct(e.target.value)}
                  value={product}
                  placeholder={"sach1-url1,sach2-url2"}
                ></textarea>
              </div>
              <button className="userUpdateButton" onClick={handleUpdateVideo}>
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
