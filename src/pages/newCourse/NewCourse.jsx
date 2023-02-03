import { useState } from "react";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./newCourse.css";
import { createCourse } from "../../api/course";
import { useRef } from "react";
import { notification } from "antd";

export default function NewCourse() {
  const [api, contextHolder] = notification.useNotification();

  const inputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [firebase, setFirebase] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const handleUpload = () => {
    if (!file) {
      return openNotificationWithIcon(
        "warning",
        "Please upload an image first!"
      );
    }
    const id = Date.now(); // generate random id
    const storageRef = ref(storage, `course/${file.name}-${id}`);
    setFirebase(`course/${file.name}-${id}`);
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
          setImage(downloadURL);
          setOpenCreate(true);
        });
      }
    );
  };

  const handleCreateCourse = async () => {
    const res = await createCourse({ image, title, description, firebase });
    if (res.status === 201) {
      openNotificationWithIcon("success", "Create Course Successfull");
    } else {
      openNotificationWithIcon("error", "Create Course Failure");
    }
    setOpenCreate(false);
    setFile(null);
    setTitle("");
    setDescription("");
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
      <h1 className="newUserTitle">New Course</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>Image</label>
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="newUserItem">
          <label>Description</label>
          <textarea
            rows="4"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write Description ..."
            value={description}
          ></textarea>
        </div>
        <div className="newUserItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="Hệ quản trị cơ sở dữ liệu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {!openCreate ? (
          <button className="newUserButton" onClick={handleUpload}>
            Upload Image
          </button>
        ) : (
          <button className="newUserButton" onClick={handleCreateCourse}>
            Create
          </button>
        )}
      </div>
      {contextHolder}
    </div>
  );
}
