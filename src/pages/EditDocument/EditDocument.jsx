import { Publish } from "@material-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "./editDocument.css";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { notification } from "antd";
import { getDocumentById, updateDocumentById } from "../../api/document";

export default function EditDocument() {
  const [api, contextHolder] = notification.useNotification();

  const { documentId } = useParams();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [index, setIndex] = useState("");
  const [firebase, setFirebase] = useState("");
  const [file, setFile] = useState("");

  const [isOpenUpdateUrl, setIsOpenUpdateUrl] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      return openNotificationWithIcon("warning", "Please choose a document");
    }
    // Delete Old File
    const desertRef = ref(storage, firebase);
    await deleteObject(desertRef);

    const id = Date.now(); // generate random id
    const storageRef = ref(storage, `document/${file.name}-${id}`);
    setFirebase(`document/${file.name}-${id}`);
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
          setIsOpenUpdateUrl(false);
        });
      }
    );
  };

  const handleUpdateDocument = async () => {
    try {
      const res = await updateDocumentById(documentId, {
        title,
        index,
        url,
        firebase,
      });
      openNotificationWithIcon("success", "Update Document Successfully");
      if (res.status === 200) {
        history.push("/document");
      }
    } catch (error) {
      openNotificationWithIcon("error", "Update Document Fauilure");
    }
  };

  const openNotificationWithIcon = useCallback(
    (type, description) => {
      api[type]({
        message: "Notification",
        description,
      });
    },
    [api]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDocumentById(documentId);
        if (res.status === 200) {
          setTitle(res.data.title);
          setIndex(res.data.index);
          setUrl(res.data.url);
          setFirebase(res.data.firebase);
        }
      } catch (error) {
        openNotificationWithIcon("error", "Lỗi hệ thống");
      }
    };
    fetchData();
  }, [documentId, openNotificationWithIcon]);
  return (
    <div className="user">
      {/* Title */}
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Document</h1>
        <Link to="/newDocument">
          <button className="userAddButton">Create</button>
        </Link>
      </div>

      {/* Infomation Edit  */}
      <div className="userContainer">
        <div className="userUpdate">
          <div className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Index</label>
                <input
                  type="number"
                  className="userUpdateInput"
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Title</label>
                <input
                  type="text"
                  className="userUpdateInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <div className="userUpdateItem">
                  <label>Url</label>
                  <input
                    type="text"
                    className="userUpdateInput"
                    disabled
                    value={url}
                  />
                </div>
                <label htmlFor="file">
                  <Publish
                    className="userUpdateIcon"
                    onClick={() => setIsOpenUpdateUrl(true)}
                  />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {!isOpenUpdateUrl ? (
                <button
                  className="userUpdateButton"
                  onClick={handleUpdateDocument}
                >
                  Update Document
                </button>
              ) : (
                <button className="userUpdateButton" onClick={handleUpload}>
                  Upload File & Update Url
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
