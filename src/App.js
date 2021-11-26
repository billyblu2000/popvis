import Main from './Main';
import TestComp from './TestComp';
import './App.css';
import "antd/dist/antd.css";

const test = false;
function App() {
    return (
        <div className="App">
            {test? <TestComp></TestComp>:<Main></Main>}
        </div>
    );
}
export default App;
