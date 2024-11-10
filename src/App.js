import "./App.scss";
import React                            from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calendar                         from "./components/Calendar";
import TodoWritePage                    from "./components/TodoWritePage";
import EventUpdate                      from "./components/EventUpdate";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Calendar/>}></Route>
        <Route path="/TodoWrite/:dateId" element={ <TodoWritePage/>}></Route>
        <Route path="/EventUpdate/:eventid" element={ <EventUpdate/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
