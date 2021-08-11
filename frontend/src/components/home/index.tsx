import Content from "./Content";
import './home.scss';
import Panel from "./Panel";

export default function Home(){
  return(
    <div className="Home">
      <Panel/>
      <Content/>
    </div>
  )
}