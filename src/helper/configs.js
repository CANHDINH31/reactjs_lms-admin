import Home from "../pages/home/Home";
import TermList from "../pages/termList/TermList";
import NewTerm from "../pages/newTerm/NewTerm";
import CourseList from "../pages/courseList/CourseList";
import VideoList from "../pages/videoList/VideoList";
import DocumentList from "../pages/documentList/DocumentList";
import SocialList from "../pages/socialList/SocialList";
import NewCourse from "../pages/newCourse/NewCourse";
import NewVideo from "../pages/newVideo/NewVideo";
import NewDocument from "../pages/newDocument/NewDocument";
import NewSocial from "../pages/newSocial/NewSocial";
import EditTerm from "../pages/EditTerm/EditTerm";
import EditCourse from "../pages/EditCourse/EditCourse";
import EditVideo from "../pages/EditVideo/EditVideo";
import EditDocument from "../pages/EditDocument/EditDocument";
import EditSocial from "../pages/EditSocial/EditSocial";

export const arrayRoutes = [
  {
    path: "/term/:termId",
    component: <EditTerm />,
  },
  {
    path: "/term",
    component: <TermList />,
  },
  {
    path: "/newTerm",
    component: <NewTerm />,
  },
  {
    path: "/course/:courseId",
    component: <EditCourse />,
  },
  {
    path: "/course",
    component: <CourseList />,
  },
  {
    path: "/newCourse",
    component: <NewCourse />,
  },
  {
    path: "/video/:videoId",
    component: <EditVideo />,
  },
  {
    path: "/video",
    component: <VideoList />,
  },
  {
    path: "/newVideo",
    component: <NewVideo />,
  },
  {
    path: "/document/:documentId",
    component: <EditDocument />,
  },
  {
    path: "/document",
    component: <DocumentList />,
  },
  {
    path: "/newDocument",
    component: <NewDocument />,
  },
  {
    path: "/social/:socialId",
    component: <EditSocial />,
  },
  {
    path: "/social",
    component: <SocialList />,
  },
  {
    path: "/newSocial",
    component: <NewSocial />,
  },
  {
    path: "/",
    component: <Home />,
  },
];

// export const baseUrl = "https://lonely-ray-pumps.cyclic.app/api";
export const baseUrl = "http://localhost:5000/api";
