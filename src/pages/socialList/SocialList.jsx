import "./socialList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Row, Button, Modal, notification, Col, Input } from "antd";
import {
  deleteSocial,
  getAllSocial,
  getLastLeastSocial,
} from "../../api/social";

const { Search } = Input;

export default function SocialList() {
  const [api, contextHolder] = notification.useNotification();

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [idDelete, setIdDelete] = useState("");
  const [arrIdSelected, setArrIdSelected] = useState([]);

  const [isDeleteMulti, setIsDeleteMulti] = useState(false);
  const [isOpenCofirmDelete, setIsOpenConfirmDelete] = useState(false);

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
      await deleteSocial(payloads);
      openNotificationWithIcon("success", "Delete Successfully");
    } catch (error) {
      openNotificationWithIcon("error", "Delete Failure");
    }
    handleCancel();
  };

  const onSearch = async () => {
    if (searchText) {
      const res = await getAllSocial(searchText);
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
      setSearchText("");
    } else {
      const res = await getLastLeastSocial();
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
    { field: "title", headerName: "Title", width: 300 },
    { field: "url", headerName: "Url", width: 470 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/social/" + params.row.id}>
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
      const res = await getLastLeastSocial();
      const newData = res.data.map((e) => ({
        ...e,
        id: e._id,
      }));
      setData(newData);
    };
    fetchData();
  }, []);

  return (
    <div className="productList">
      {/* Search Bar */}
      <Row>
        <Col span={8} offset={16}>
          <Search
            placeholder="Title Social"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={onSearch}
            enterButton
            style={{ marginBottom: "10px" }}
          />
        </Col>
      </Row>

      {/* List Social */}
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

      {/* Notification */}
      {contextHolder}
    </div>
  );
}
