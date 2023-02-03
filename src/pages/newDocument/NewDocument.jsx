import { useState, useRef } from "react";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./newDocument.css";
import { notification } from "antd";
import { createDocument } from "../../api/document";

export default function NewDocument() {
  const [api, contextHolder] = notification.useNotification();
  const inputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [index, setIndex] = useState(1);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState("");
  const [firebase, setFireBase] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const handleUpload = () => {
    if (!file) {
      return openNotificationWithIcon(
        "warning",
        "Please upload an document file"
      );
    }
    const id = Date.now(); // generate random id
    const storageRef = ref(storage, `document/${file.name}-${id}`);
    setFireBase(`document/${file.name}-${id}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
          setOpenCreate(true);
        });
      }
    );
  };

  const handleCreateDocument = async () => {
    const res = await createDocument({ url, title, index, firebase });
    if (res.status === 201) {
      openNotificationWithIcon("success", "Create Document Successfull");
    } else {
      openNotificationWithIcon("error", "Create Document Failure");
    }
    setOpenCreate(false);
    setFile(null);
    setTitle("");
    setIndex((prev) => Number(prev) + 1);
    inputRef.current.value = null;
  };

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New Document</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>File</label>
          <input
            ref={inputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".pdf,.doc,.docx"
          />
        </div>
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
          <label>Title</label>
          <input
            type="text"
            placeholder="Chương trình dịch - Chương 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {!openCreate ? (
          <button className="newUserButton" onClick={handleUpload}>
            Upload File
          </button>
        ) : (
          <button className="newUserButton" onClick={handleCreateDocument}>
            Create
          </button>
        )}
      </div>
      {contextHolder}
    </div>
  );
}
