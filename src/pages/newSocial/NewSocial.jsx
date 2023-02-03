import { useState } from "react";
import "./newSocial.css";
import { notification } from "antd";
import { createSocial } from "../../api/social";

export default function NewSocial() {
  const [api, contextHolder] = notification.useNotification();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const handleCreateSocial = async () => {
    try {
      await createSocial({ title, url });
      openNotificationWithIcon("success", "Create Social Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Create Social Failure");
    }
    resetFiled();
  };

  const resetFiled = () => {
    setTitle("");
    setUrl("");
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New Social</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="Yotube"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="newUserItem">
          <label>Url</label>
          <input
            type="text"
            placeholder="https://youtu.be/5OJkq-ig3rw"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button className="newUserButton" onClick={handleCreateSocial}>
          Create
        </button>
      </div>
      {contextHolder}
    </div>
  );
}
