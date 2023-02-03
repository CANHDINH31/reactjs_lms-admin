import { Publish } from "@material-ui/icons";
import {
  EditOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getTermById, updateTermById } from "../../api/term";
import "./editTerm.css";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { DataGrid } from "@material-ui/data-grid";
import { Button, Typography, Row, Modal, notification } from "antd";
import { removeCourseFromTerm } from "../../api/course";

export default function EditTerm() {
  const [api, contextHolder] = notification.useNotification();

  const { termId } = useParams();
  const history = useHistory();

  const [arrCourse, setArrCourse] = useState([]);
  const [idSelected, setIdSelected] = useState("");
  const [arrIdSelected, setArrIdSelected] = useState([]);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [firebase, setFirebase] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  const [isOpenUpdateImg, setIsOpenUpdateImg] = useState(false);
  const [isOpenConfirmRemoveCourse, setIsOpenConfirmRemoveCourse] =
    useState(false);
  const [isOpenRemoveMultiCourse, setIsOpenRemoveMultiCourse] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      return alert("Please upload an image first!");
    }

    // Delete firebase storage
    const desertRef = ref(storage, firebase);
    await deleteObject(desertRef);

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
          setIsOpenUpdateImg(false);
        });
      }
    );
  };

  const handleUpdateTerm = async () => {
    try {
      const res = await updateTermById(termId, {
        image,
        title,
        description,
        firebase,
      });
      openNotificationWithIcon("success", "Update Term Successfully");
      if (res.status === 200) {
        history.push("/term");
      }
    } catch (error) {
      openNotificationWithIcon("error", "Update Term Fauilure");
    }
  };

  const handleRemove = async () => {
    try {
      setArrCourse(arrCourse.filter((i) => i.id !== idSelected));
      const payloads = { arrayCourse: [idSelected], idTerm: termId };
      await removeCourseFromTerm(payloads);
      openNotificationWithIcon("success", "Remove Term Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    handleCancelRemove();
  };

  const handleRemoveMulti = async () => {
    try {
      setArrCourse(arrCourse.filter((i) => !arrIdSelected.includes(i._id)));
      const payloads = { arrayCourse: arrIdSelected, idTerm: termId };
      await removeCourseFromTerm(payloads);
      openNotificationWithIcon("success", "Remove Term Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Error when handle active");
    }
    setIsOpenRemoveMultiCourse(false);
    setArrIdSelected([]);
  };

  const handleCancelRemove = () => {
    setIsOpenConfirmRemoveCourse(false);
    setIdSelected("");
  };

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 110,
      renderCell: (params) => {
        return <img className="productListImg" src={params.row.image} alt="" />;
      },
    },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 420,
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
                setIsOpenConfirmRemoveCourse(true);
                setIdSelected(params.row.id);
              }}
            />
            <Link to={`/course/${params.row.id}`}>
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
        const res = await getTermById(termId);
        const newData = res.data?.courses.map((e) => ({
          ...e,
          id: e._id,
        }));
        if (res.status === 200) {
          setTitle(res.data.title);
          setImage(res.data.image);
          setFirebase(res.data.firebase);
          setDescription(res.data.description);
          setArrCourse(newData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [termId]);
  return (
    <div className="user">
      {/* Title */}
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit Term</h1>
        <Link to="/newTerm">
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
                <button className="userUpdateButton" onClick={handleUpdateTerm}>
                  Update Term
                </button>
              ) : (
                <button className="userUpdateButton" onClick={handleUpload}>
                  Upload & Update Image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Course Of Term */}
      <div className="userContainer">
        <div className="userUpdate">
          <Typography.Title level={5}>List Course</Typography.Title>
          {arrCourse?.length > 0 ? (
            <DataGrid
              rows={arrCourse}
              columns={columns}
              pageSize={8}
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
              <Link to="/course">
                <Button type="primary" icon={<FolderAddOutlined />}>
                  Add Course To Term
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
                onClick={() => setIsOpenRemoveMultiCourse(true)}
              >
                Remove Multi From Term
              </Button>
            </Row>
          )}
        </div>
      </div>

      {/* Modal Remove from term a course */}
      <Modal
        title="Confirm Remove"
        open={isOpenConfirmRemoveCourse}
        onOk={handleRemove}
        onCancel={handleCancelRemove}
      >
        <p>Are you sure want to remove this course from term ?</p>
      </Modal>

      {/* Modal Remove from term multi course */}
      <Modal
        title="Confirm Remove"
        open={isOpenRemoveMultiCourse}
        onOk={handleRemoveMulti}
        onCancel={() => {
          setIsOpenRemoveMultiCourse(false);
          setArrIdSelected([]);
        }}
      >
        <p>Are you sure want to remove these course from term ?</p>
      </Modal>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
