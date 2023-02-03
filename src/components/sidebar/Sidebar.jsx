import "./sidebar.css";
import {
  SchoolOutlined,
  LibraryBooksOutlined,
  LiveTvOutlined,
  AttachFileOutlined,
  PermMediaOutlined,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">List Database</h3>
          <ul className="sidebarList">
            <Link to="/term" className="link">
              <li className="sidebarListItem">
                <SchoolOutlined className="sidebarIcon" />
                Term
              </li>
            </Link>
            <Link to="/course" className="link">
              <li className="sidebarListItem">
                <LibraryBooksOutlined className="sidebarIcon" />
                Course
              </li>
            </Link>
            <Link to="/video" className="link">
              <li className="sidebarListItem">
                <LiveTvOutlined className="sidebarIcon" />
                Video
              </li>
            </Link>
            <Link to="/document" className="link">
              <li className="sidebarListItem">
                <AttachFileOutlined className="sidebarIcon" />
                Document
              </li>
            </Link>
            <Link to="/social" className="link">
              <li className="sidebarListItem">
                <PermMediaOutlined className="sidebarIcon" />
                Social Media
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Create Database</h3>
          <ul className="sidebarList">
            <Link to="/newTerm" className="link">
              <li className="sidebarListItem">
                <SchoolOutlined className="sidebarIcon" />
                Term
              </li>
            </Link>
            <Link to="/newCourse" className="link">
              <li className="sidebarListItem">
                <LibraryBooksOutlined className="sidebarIcon" />
                Course
              </li>
            </Link>
            <Link to="/newVideo" className="link">
              <li className="sidebarListItem">
                <LiveTvOutlined className="sidebarIcon" />
                Video
              </li>
            </Link>
            <Link to="/newDocument" className="link">
              <li className="sidebarListItem">
                <AttachFileOutlined className="sidebarIcon" />
                Document
              </li>
            </Link>
            <Link to="/newSocial" className="link">
              <li className="sidebarListItem">
                <PermMediaOutlined className="sidebarIcon" />
                Social Media
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
