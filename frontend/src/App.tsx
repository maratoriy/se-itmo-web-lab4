import React, {useEffect} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'

import './style.scss';
import {useDispatch, useSelector} from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {AUTHORIZATION_STATUS, authorize, User} from "./api/auth";
import store from "./store/store";
import {get, setDots} from "./api/util";

function App() {
    const user: User = useSelector((state: {user: User}) => state.user)
    const authorized: boolean = user.status == AUTHORIZATION_STATUS.AUTHORIZED

    const dispatch = useDispatch()
    useEffect(() => {
        get().then((data) => dispatch(setDots(data)))
    })

    return (
        <Routes>
            <Route path ="/login" element ={authorized ? <HomePage/> : <LoginPage/>}/>
            <Route path ="/register" element ={authorized ?  <HomePage/> : <RegisterPage/>}/>
            <Route path ="/" element ={authorized ? <HomePage/> : <Navigate to="/login"/>}/>
            <Route path ="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}

export default App;
