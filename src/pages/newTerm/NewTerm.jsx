import { useState } from "react";
import { createTerm } from "../../api/term";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./newTerm.css";
import { useHistory } from "react-router-dom";

export default function NewTerm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [firebase, setFirebase] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const history = useHistory();

  const handleUpload = () => {
    if (!file) {
      return alert("Please upload an image first!");
    }
    const id = Date.now(); // generate random id
    const storageRef = ref(storage, `term/${file.name}-${id}`);
    setFirebase(`term/${file.name}-${id}`);
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

  const handleCreateTerm = async () => {
    const res = await createTerm({ image, title, description, firebase });
    if (res.status === 201) {
      history.push("/term");
    } else {
      console.log("Error");
    }
  };

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New Term</h1>
      <div className="newUserForm">
        <div className="newUserItem">
          <label>Image</label>
          <input
            type="file"
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
            placeholder="Năm nhất"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {!openCreate ? (
          <button className="newUserButton" onClick={handleUpload}>
            Upload Image
          </button>
        ) : (
          <button className="newUserButton" onClick={handleCreateTerm}>
            Create
          </button>
        )}
      </div>
    </div>
  );
}
