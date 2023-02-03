import "./termList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteTerm, getAllTerm, getLastLeastTerm } from "../../api/term";
import { Input, Row, Col, Modal, notification } from "antd";
import { storage } from "../../firebaseConfig";
import { ref, deleteObject } from "firebase/storage";

const { Search } = Input;

export default function TermList() {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [idDelete, setIdDelete] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleDelete = async () => {
    try {
      setData(data.filter((item) => item.id === idDelete));

      const firebase = data.find((item) => item.id === idDelete)?.firebase;

      //delete in firebase storage
      const desertRef = ref(storage, firebase);
      await deleteObject(desertRef);

      // delete in database
      await deleteTerm(idDelete);
      openNotificationWithIcon("success", "Delete Term Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Delete Term Failure");
    }
    handleCancel();
  };

  const handleCancel = () => {
    setIdDelete(null);
    setIsOpenModal(false);
  };

  const handleOpenConfirm = (id) => {
    setIdDelete(id);
    setIsOpenModal(true);
  };

  const onSearch = async () => {
    if (searchText) {
      const res = await getAllTerm(searchText);
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    } else {
      const res = await getLastLeastTerm();
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
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: (params) => {
        return <img className="userListImg" src={params.row.image} alt="" />;
      },
    },
    { field: "title", headerName: "Title", width: 120 },
    {
      field: "description",
      headerName: "Description",
      width: 540,
    },
    {
      field: "Courses",
      width: 150,
      renderCell: (params) => {
        return <span>{params.row?.courses?.length}</span>;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/term/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleOpenConfirm(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLastLeastTerm();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
    };
    fetchData();
  }, []);

  return (
    <div className="userList">
      {/* Search Input */}
      <Row>
        <Col span={8} offset={16}>
          <Search
            placeholder="Title Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: "10px" }}
          />
        </Col>
      </Row>

      {/* Data */}
      <DataGrid
        rows={data}
        columns={columns}
        rowHeight={120}
        style={{ maxHeight: "75vh" }}
      />

      {/* Confirm Delete */}
      <Modal
        title="Confirm Delete"
        open={isOpenModal}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p>Are you sure want to delete this term ?</p>
      </Modal>

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
