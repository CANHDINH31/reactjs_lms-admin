import "./home.css";
import HomeBg from "../../asset/images/home_bg.jpg";

export default function Home() {
  return (
    <div className="home">
      <img src={HomeBg} className="home_bg" alt="home-background" />
    </div>
  );
}
