import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { getRoutes } from "./routes";

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        {getRoutes()}
      </div>
    </Router>
  );
}

export default App;
