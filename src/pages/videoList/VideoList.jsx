import "./videoList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getLastLeastVideo,
  getAllVideo,
  deleteVideo,
  addVideoToCourse,
} from "../../api/video";
import { Row, Button, Modal, notification, Select, Col, Input } from "antd";
import { getAllCourse } from "../../api/course";

const { Search } = Input;

export default function VideoList() {
  const [api, contextHolder] = notification.useNotification();

  const [data, setData] = useState([]);
  const [arrayCourse, setArrayCourse] = useState([]);
  const [idCourse, setIdCourse] = useState("");
  const [searchText, setSearchText] = useState("");

  const [idDelete, setIdDelete] = useState("");
  const [arrIdSelected, setArrIdSelected] = useState([]);

  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [isOpenCofirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isOpenAddToCourse, setIsOpenAddToCourse] = useState(false);

  const handleCancel = () => {
    setIdDelete("");
    setArrIdSelected([]);
    setIsOpenConfirmDelete(false);
    setIsDeleteMulti(false);
  };

  const handleDelete = async () => {
    let payloads = {};
    if (!isDeleteMulti) {
      payloads = { arrayId: idDelete };
      setData(data.filter((item) => item.id !== idDelete));
    } else {
      payloads = { arrayId: arrIdSelected };
      const newData = data.filter((i) => !arrIdSelected.includes(i._id));
      setData(newData);
    }
    try {
      await deleteVideo(payloads);
      openNotificationWithIcon("success", "Delete Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Delete Failure");
    }
    handleCancel();
  };

  const handleAddToCourse = async () => {
    if (!idCourse)
      return openNotificationWithIcon("warning", "Please choose a course");
    try {
      const payloads = {
        arrayVideo: arrIdSelected,
        idCourse,
      };
      await addVideoToCourse(payloads);
      openNotificationWithIcon("success", "Add Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Add Fauilure");
    }
    setArrIdSelected([]);
    setIsOpenAddToCourse(false);
    setIdCourse("");
  };

  const onSearch = async () => {
    if (searchText) {
      const res = await getAllVideo(searchText);
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    } else {
      const res = await getLastLeastVideo();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    }
  };

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const columns = [
    { field: "index", headerName: "Index", width: 110 },
    { field: "title", headerName: "Title", width: 250 },
    { field: "url", headerName: "Url", width: 220 },
    { field: "product", headerName: "Product", width: 220 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/video/" + params.row.id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => {
                setIdDelete(params.row.id);
                setIsOpenConfirmDelete(true);
                setIsDeleteMulti(false);
              }}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLastLeastVideo();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
    };
    const fetchArrayCourse = async () => {
      const res = await getAllCourse();
      const newData = res.data.map((e) => ({
        value: e._id,
        label: e.title,
      }));
      setArrayCourse(newData);
    };
    fetchData();
    fetchArrayCourse();
  }, []);

  return (
    <div className="productList">
      {/* Search Bar */}
      <Row>
        <Col span={8} offset={16}>
          <Search
            placeholder="Title Video"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: "10px" }}
          />
        </Col>
      </Row>

      {/* List Video */}
      <DataGrid
        rows={data}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        style={{ maxHeight: "80vh" }}
        onSelectionModelChange={(arrayId) => {
          setArrIdSelected(arrayId);
        }}
        selectionModel={arrIdSelected}
      />

      {/* Button Setting */}
      <Row
        style={{
          margin: "10px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {arrIdSelected?.length > 0 && (
          <Button type="primary" onClick={() => setIsOpenAddToCourse(true)}>
            Add To Course
          </Button>
        )}
        {arrIdSelected?.length > 1 && (
          <Button
            type="primary"
            danger
            onClick={() => {
              setIsOpenConfirmDelete(true);
              setIsDeleteMulti(true);
            }}
          >
            Delete Multi
          </Button>
        )}
      </Row>

      {/* Modal Delete video */}
      <Modal
        title="Confirm Delete"
        open={isOpenCofirmDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p>Are you sure want to delete ?</p>
      </Modal>

      {/* Modal add to course */}
      <Modal
        title="Choose the course"
        open={isOpenAddToCourse}
        onOk={handleAddToCourse}
        onCancel={() => {
          setIsOpenAddToCourse(false);
          setArrIdSelected([]);
        }}
      >
        <Select
          showSearch
          style={{ width: "75%" }}
          placeholder="Search Term to Select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={arrayCourse}
          onChange={(value) => {
            setIdCourse(value);
          }}
        />
      </Modal>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
