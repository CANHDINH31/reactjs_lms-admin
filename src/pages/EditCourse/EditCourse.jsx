import { Publish } from "@material-ui/icons";
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "./editCourse.css";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { DataGrid } from "@material-ui/data-grid";
import { Button, Typography, Row, Modal, notification } from "antd";
import { getCourseById, updateCourseById } from "../../api/course";
import { removeVideoFromCourse } from "../../api/video";
import { removeDocumentFromCourse } from "../../api/document";

export default function EditCourse() {
  const [api, contextHolder] = notification.useNotification();

  const { courseId } = useParams();
  const history = useHistory();

  const [arrVideo, setArrVideo] = useState([]);
  const [arrDocument, setArrDocument] = useState([]);

  const [idSelected, setIdSelected] = useState("");
  const [arrIdSelected, setArrIdSelected] = useState([]);

  const [idDocumentSelected, setIdDocumentSelected] = useState("");
  const [arrIdDocumentSelected, setArrIdDocumentSelected] = useState([]);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [firebase, setFirebase] = useState("");

  const [isOpenUpdateImg, setIsOpenUpdateImg] = useState(false);

  const [isOpenConfirmRemoveVideo, setIsOpenConfirmRemoveVideo] =
    useState(false);
  const [isOpenRemoveMultiVideo, setIsOpenRemoveMultiVideo] = useState(false);
  const [isOpenConfirmRemoveDocument, setIsOpenConfirmRemoveDocument] =
    useState(false);
  const [isOpenRemoveMultiDocument, setIsOpenRemoveMultiDocument] =
    useState(false);

  const handleUpload = async () => {
    if (!file) {
      return alert("Please upload an image first!");
    }
    // Delete firebase storage
    const desertRef = ref(storage, firebase);
    await deleteObject(desertRef);

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
          setIsOpenUpdateImg(false);
        });
      }
    );
  };

  const handleUpdateCourse = async () => {
    try {
      const res = await updateCourseById(courseId, {
        image,
        title,
        description,
        firebase,
      });
      openNotificationWithIcon("success", "Update Course Successfully");
      if (res.status === 200) {
        history.push("/course");
      }
    } catch (error) {
      openNotificationWithIcon("error", "Update Course Fauilure");
    }
  };

  const handleRemove = async () => {
    try {
      setArrVideo(arrVideo.filter((i) => i.id !== idSelected));
      const payloads = { arrayVideo: [idSelected], idCourse: courseId };
      await removeVideoFromCourse(payloads);
      openNotificationWithIcon("success", "Remove Video Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    handleCancelRemove();
  };

  const handleRemoveDocument = async () => {
    try {
      setArrDocument(arrDocument.filter((i) => i.id !== idDocumentSelected));
      const payloads = {
        arrayDocument: [idDocumentSelected],
        idCourse: courseId,
      };
      await removeDocumentFromCourse(payloads);
      openNotificationWithIcon("success", "Remove Document Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    handleCancelRemoveDocument();
  };

  const handleRemoveMulti = async () => {
    try {
      setArrVideo(arrVideo.filter((i) => !arrIdSelected.includes(i._id)));
      const payloads = { arrayVideo: arrIdSelected, idCourse: courseId };
      await removeVideoFromCourse(payloads);
      openNotificationWithIcon("success", "Remove Video Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    setIsOpenRemoveMultiVideo(false);
    setArrIdSelected([]);
  };
  const handleRemoveMultiDocument = async () => {
    try {
      setArrDocument(
        arrDocument.filter((i) => !arrIdDocumentSelected.includes(i._id))
      );
      const payloads = {
        arrayDocument: arrIdDocumentSelected,
        idCourse: courseId,
      };
      await removeDocumentFromCourse(payloads);
      openNotificationWithIcon("success", "Remove Document Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    setIsOpenRemoveMultiDocument(false);
    setArrIdDocumentSelected([]);
  };

  const handleCancelRemove = () => {
    setIsOpenConfirmRemoveVideo(false);
    setIdSelected("");
  };

  const handleCancelRemoveDocument = () => {
    setIsOpenConfirmRemoveDocument(false);
    setIdDocumentSelected("");
  };

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const columns = [
    { field: "index", headerName: "Index", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "url",
      headerName: "Url",
      width: 220,
    },
    {
      field: "product",
      headerName: "Product",
      width: 220,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{ marginRight: "4px" }}
              onClick={() => {
                setIsOpenConfirmRemoveVideo(true);
                setIdSelected(params.row.id);
              }}
            />
            <Link to={`/video/${params.row.id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
          </>
        );
      },
    },
  ];

  const columnsDocument = [
    { field: "index", headerName: "Index", width: 150 },
    { field: "title", headerName: "Title", width: 250 },
    {
      field: "url",
      headerName: "Url",
      width: 320,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              style={{ marginRight: "4px" }}
              onClick={() => {
                setIsOpenConfirmRemoveDocument(true);
                setIdDocumentSelected(params.row.id);
              }}
            />
            <Link to={`/document/${params.row.id}`}>
              <Button type="primary" icon={<EditOutlined />} />
            </Link>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourseById(courseId);
        const newDataVideo = res.data?.videos
          .map((e) => ({
            ...e,
            id: e._id,
          }))
          .sort(function (a, b) {
            return a.index - b.index;
          });
        const newDataDocument = res.data?.documents
          .map((e) => ({
            ...e,
            id: e._id,
          }))
          .sort(function (a, b) {
            return a.index - b.index;
          });
        if (res.status === 200) {
          setTitle(res.data.title);
          setImage(res.data.image);
          setDescription(res.data.description);
          setFirebase(res.data.firebase);
          setArrVideo(newDataVideo);
          setArrDocument(newDataDocument);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [courseId]);

  return (
    <div className="user">
      {/* Title */}
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Course</h1>
        <Link to="/newCourse">
          <button className="userAddButton">Create</button>
        </Link>
      </div>

      {/* Infomation Edit  */}
      <div className="userContainer">
        <div className="userUpdate">
          <div className="userUpdateForm">
            <div className="userUpdateLeft">
              <div className="userUpdateItem">
                <label>Title</label>
                <input
                  type="text"
                  className="userUpdateInput"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="userUpdateItem">
                <label>Description</label>
                <textarea
                  rows={8}
                  placeholder="Write description ..."
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                ></textarea>
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img className="userUpdateImg" src={image} alt="" />
                <label htmlFor="file">
                  <Publish
                    className="userUpdateIcon"
                    onClick={() => setIsOpenUpdateImg(true)}
                  />
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                />
              </div>
              {!isOpenUpdateImg ? (
                <button
                  className="userUpdateButton"
                  onClick={handleUpdateCourse}
                >
                  Update Course
                </button>
              ) : (
                <button className="userUpdateButton" onClick={handleUpload}>
                  Upload & Upload Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Video Of Course */}
      <div className="userContainer">
        <div className="userUpdate">
          <Typography.Title level={5}>List Video</Typography.Title>
          {arrVideo?.length > 0 ? (
            <DataGrid
              rows={arrVideo}
              columns={columns}
              pageSize={20}
              rowHeight={120}
              checkboxSelection
              disableSelectionOnClick
              style={{ height: "80vh" }}
              onSelectionModelChange={(arrayId) => {
                setArrIdSelected(arrayId);
              }}
              selectionModel={arrIdSelected}
            />
          ) : (
            <Row
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Link to="/video">
                <Button type="primary" icon={<FolderAddOutlined />}>
                  Add Video To Course
                </Button>
              </Link>
            </Row>
          )}

          {/* Button Remove Multi */}
          {arrIdSelected?.length > 1 && (
            <Row
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                danger
                onClick={() => setIsOpenRemoveMultiVideo(true)}
              >
                Remove Multi From Course
              </Button>
            </Row>
          )}
        </div>
      </div>

      {/* List Document Of Course */}
      <div className="userContainer">
        <div className="userUpdate">
          <Typography.Title level={5}>List Document</Typography.Title>
          {arrDocument?.length > 0 ? (
            <DataGrid
              rows={arrDocument}
              columns={columnsDocument}
              pageSize={20}
              rowHeight={120}
              checkboxSelection
              disableSelectionOnClick
              style={{ height: "80vh" }}
              onSelectionModelChange={(arrayId) => {
                setArrIdDocumentSelected(arrayId);
              }}
              selectionModel={arrIdDocumentSelected}
            />
          ) : (
            <Row
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Link to="/document">
                <Button type="primary" icon={<FolderAddOutlined />}>
                  Add Document To Course
                </Button>
              </Link>
            </Row>
          )}

          {/* Button Remove Multi */}
          {arrIdDocumentSelected?.length > 1 && (
            <Row
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                danger
                onClick={() => setIsOpenRemoveMultiDocument(true)}
              >
                Remove Multi From Course
              </Button>
            </Row>
          )}
        </div>
      </div>

      {/* Modal Remove from course a video */}
      <Modal
        title="Confirm Remove"
        open={isOpenConfirmRemoveVideo}
        onOk={handleRemove}
        onCancel={handleCancelRemove}
      >
        <p>Are you sure want to remove this video from course ?</p>
      </Modal>

      {/* Modal Remove from course a document */}
      <Modal
        title="Confirm Remove Document"
        open={isOpenConfirmRemoveDocument}
        onOk={handleRemoveDocument}
        onCancel={handleCancelRemoveDocument}
      >
        <p>Are you sure want to remove this document from course ?</p>
      </Modal>

      {/* Modal Remove from course multi video */}
      <Modal
        title="Confirm Remove"
        open={isOpenRemoveMultiVideo}
        onOk={handleRemoveMulti}
        onCancel={() => {
          setIsOpenRemoveMultiVideo(false);
          setArrIdSelected([]);
        }}
      >
        <p>Are you sure want to remove these videos from courses ?</p>
      </Modal>

      {/* Modal Remove from course multi document */}
      <Modal
        title="Confirm Remove Document"
        open={isOpenRemoveMultiDocument}
        onOk={handleRemoveMultiDocument}
        onCancel={() => {
          setIsOpenRemoveMultiDocument(false);
          setArrIdDocumentSelected([]);
        }}
      >
        <p>Are you sure want to remove these documents from courses ?</p>
      </Modal>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
