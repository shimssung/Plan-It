import { Route, Routes } from "react-router-dom";
import TodoWritePage from "./components/TodoWritePage";

function RouterApp(props) {
    return (
        <div className="container">
            <Routes>
                {/* /TodoWrite 매칭이되면 element 안에있는 TodoWritePage 리턴 */}
                <Route path="/TodoWrite" element={<TodoWritePage/>}></Route>
            </Routes>
        </div>
    )  ;
};
export default RouterApp ;