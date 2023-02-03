import { useState } from "react";
import "./newVideo.css";
import { notification } from "antd";
import { createVideo } from "../../api/video";

export default function NewVideo() {
  const [api, contextHolder] = notification.useNotification();

  const [index, setIndex] = useState(1);
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [url, setUrl] = useState("");

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const handleCreateVideo = async () => {
    try {
      await createVideo({ index, title, product, url });
      setIndex((prev) => Number(prev) + 1);
      openNotificationWithIcon("success", "Create Video Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Create Video Failure");
    }
    resetFiled();
  };

  const resetFiled = () => {
    setProduct("");
    setTitle("");
    setUrl("");
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New Video</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>Index</label>
          <input
            type="number"
            placeholder="1"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Product</label>
          <textarea
            rows="4"
            onChange={(e) => setProduct(e.target.value)}
            placeholder="name1-url1,name2-url2,name3-url3"
            value={product}
          ></textarea>
        </div>
        <div className="newUserItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="Hệ quản trị cơ sở dữ liệu - Buổi số 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Url</label>
          <input
            type="text"
            placeholder="https://youtu.be/7sBMJ8p96zE"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button className="newUserButton" onClick={handleCreateVideo}>
          Create
        </button>
      </div>
      {contextHolder}
    </div>
  );
}
