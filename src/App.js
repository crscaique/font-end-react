import './App.css';
import './styles/GlobalStyles.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/login";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import EditTodoForm from "./components/Edittodo";
import Layout from "./components/layout/Layout";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/register" element={<Register/>} />
                        <Route path="/login" element={<Login/>} />
                        <Route path="/logout" element={<Logout/>} />
                        <Route path="/dashboard" element={<Dashboard/>} />
                        <Route path="/edit-note/:id" element={<EditTodoForm/>} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </div>
    );
}

export default App;