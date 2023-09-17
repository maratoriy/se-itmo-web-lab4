import React, {FormEvent, useState} from "react";
import {Button, Card, Container, Form, FormGroup, FormLabel, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../resources/icon.png"
import AuthTemplate from "../components/AuthTemplate";
import {authorize, LOGIN_STATUS, loginUser} from "../api/auth";
import {useDispatch} from "react-redux";

const errorMessages: { [key in LOGIN_STATUS]?: any} = {
    [LOGIN_STATUS.INVALID_CREDENTIALS]: "Неверный логин или пароль"
}

function LoginForm() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const [invalid, setInvalid] = useState(false)

    const lockButton = login!="" && password!=""

    const dispatch = useDispatch()
    const submitForm = (e: FormEvent) => {
        e.preventDefault()
        loginUser({login, password}).then((status) => {
            if (status != LOGIN_STATUS.LOGIN_OK) {
                setInvalid(true)
                setPassword("")
                return
            }
            dispatch(authorize(login))
        })
    }

    return (
        <><Container className="mt-4 p-4" fluid>
            <h2 className="mb-4">Войти</h2>
            <Form onSubmit={submitForm}>
                <FormGroup className='mb-3'>
                    <Form.Label className='text-secondary'>Логин</Form.Label>
                    <Form.Control type='text' placeholder='Логин' name="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Form.Label className='text-secondary'>Пароль</Form.Label>
                    <Form.Control isInvalid={invalid} type='password' placeholder='Пароль' name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">Неверный логин или пароль!</Form.Control.Feedback>
                </FormGroup>
                <Container fluid className='d-flex justify-content-end p-0'>
                    <Button className='px-3' type="submit" disabled={!lockButton}>Войти</Button>
                </Container>
            </Form>
        </Container><Container fluid className='p-0 bg-light py-3 d-flex justify-content-center'>
            <span>Нет учетной записи? <Link to={"/register"}>Создать</Link></span>
        </Container></>
    )
}

function LoginPage() {
    return (
        <AuthTemplate content={<LoginForm/>}/>
    )
}

export default LoginPage;