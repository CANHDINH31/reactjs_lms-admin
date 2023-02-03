import "./courseList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addCourseToTerm,
  deleteCourse,
  deleteMultiCourse,
  getAllCourse,
  getLastLeastCourse,
} from "../../api/course";
import { getAllTerm } from "../../api/term";
import { Row, Button, Modal, notification, Select, Col, Input } from "antd";
import { storage } from "../../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";

const { Search } = Input;
export default function CourseList() {
  const [api, contextHolder] = notification.useNotification();

  const [data, setData] = useState([]);
  const [arrayTerm, setArrayTerm] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [idCourseDelete, setIdCourseDelete] = useState(null);
  const [arrIdSelected, setArrIdSelected] = useState([]);
  const [idTerm, setIdTerm] = useState("");

  const [isOpenCofirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isOpenConfirmDeleteMulti, setIsOpenConfirmDeleteMulti] =
    useState(false);
  const [isOpenAddToTerm, setIsOpenAddToTerm] = useState(false);

  const handleOpenConfirmDelete = (id) => {
    setIdCourseDelete(id);
    setIsOpenConfirmDelete(true);
  };

  const handleDelete = async () => {
    setData(data.filter((item) => item.id !== idCourseDelete));
    try {
      const firebase = data.find(
        (item) => item.id === idCourseDelete
      )?.firebase;

      //delete in firebase storage
      const desertRef = ref(storage, firebase);
      await deleteObject(desertRef);

      await deleteCourse(idCourseDelete);
      openNotificationWithIcon("success", "Delete Course Successful");
    } catch (error) {
      openNotificationWithIcon("error", "Delete Course Fauilure");
    }

    handleCancel();
  };

  const handleDeleteMulti = async () => {
    const newData = data.filter((i) => !arrIdSelected.includes(i._id));
    setData(newData);
    const firebase = data
      .filter((i) => arrIdSelected.includes(i._id))
      ?.map((e) => e.firebase);
    try {
      const payloads = { arrayId: arrIdSelected };

      for (let i = 0; i < firebase?.length; i++) {
        const desertRef = ref(storage, firebase[i]);
        await deleteObject(desertRef);
      }
      await deleteMultiCourse(payloads);
      openNotificationWithIcon("success", "Delete Course Successful");
    } catch (error) {
      openNotificationWithIcon("error", "Delete Course Fauilure");
    }
    setIsOpenConfirmDeleteMulti(false);
  };

  const handleAddToTerm = async () => {
    if (!idTerm)
      return openNotificationWithIcon("warning", "Please choose a term");
    try {
      const payloads = {
        arrayCourse: arrIdSelected,
        idTerm,
      };
      await addCourseToTerm(payloads);
      openNotificationWithIcon("success", "Add Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Add Fauilure");
    }
    setArrIdSelected([]);
    setIsOpenAddToTerm(false);
    setIdTerm("");
  };

  const handleCancel = () => {
    setIdCourseDelete(null);
    setIsOpenConfirmDelete(false);
  };

  const openNotificationWithIcon = (type, description) => {
    api[type]({
      message: "Notification",
      description,
    });
  };

  const onSearch = async () => {
    if (searchText) {
      const res = await getAllCourse(searchText);
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    } else {
      const res = await getLastLeastCourse();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    }
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
      width: 320,
    },
    {
      field: "Video",
      width: 120,
      renderCell: (params) => {
        return <span>{params.row?.videos?.length}</span>;
      },
    },
    {
      field: "Doc",
      width: 120,
      renderCell: (params) => {
        return <span>{params.row?.documents?.length}</span>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/course/" + params.row.id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleOpenConfirmDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLastLeastCourse();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
    };
    const fetchArrayTerm = async () => {
      const res = await getAllTerm();
      const newData = res.data.map((e) => ({
        value: e._id,
        label: e.title,
      }));
      setArrayTerm(newData);
    };
    fetchData();
    fetchArrayTerm();
  }, []);

  return (
    <div className="productList">
      {/* Search Bar */}
      <Row>
        <Col span={8} offset={16}>
          <Search
            placeholder="Title Course"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: "10px" }}
          />
        </Col>
      </Row>

      {/* Table Data */}
      <DataGrid
        rows={data}
        columns={columns}
        rowHeight={120}
        checkboxSelection
        disableSelectionOnClick
        style={{ maxHeight: "80vh" }}
        onSelectionModelChange={(arrayId) => {
          setArrIdSelected(arrayId);
        }}
        selectionModel={arrIdSelected}
      />

      {/* Modal Delete a course */}
      <Modal
        title="Confirm Delete"
        open={isOpenCofirmDelete}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p>Are you sure want to delete this course ?</p>
      </Modal>

      {/* Modal Delete multi course */}
      <Modal
        title="Confirm Delete Multi"
        open={isOpenConfirmDeleteMulti}
        onOk={handleDeleteMulti}
        onCancel={() => setIsOpenConfirmDeleteMulti(false)}
      >
        <p>Are you sure want to delete these course ?</p>
      </Modal>

      {/* Modal add to term */}
      <Modal
        title="Choose the term"
        open={isOpenAddToTerm}
        onOk={handleAddToTerm}
        onCancel={() => setIsOpenAddToTerm(false)}
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
          options={arrayTerm}
          onChange={(value) => {
            setIdTerm(value);
          }}
        />
      </Modal>

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
          <Button type="primary" onClick={() => setIsOpenAddToTerm(true)}>
            Add To Term
          </Button>
        )}
        {arrIdSelected?.length > 1 && (
          <Button
            type="primary"
            danger
            onClick={() => setIsOpenConfirmDeleteMulti(true)}
          >
            Delete Multi
          </Button>
        )}
      </Row>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
