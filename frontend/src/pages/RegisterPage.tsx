import React, {FormEvent, useState} from "react";
import AuthTemplate from "../components/AuthTemplate";
import {Button, Container, Form, FormGroup} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {authorize, LOGIN_STATUS, loginUser, REGISTER_STATUS, registerUser} from "../api/auth";
import {Link} from "react-router-dom";

const errorMessages: { [key in REGISTER_STATUS]?: any} = {
    [REGISTER_STATUS.INVALID_USER]: "Такой пользователь уже существует"
}

function RegisterForm() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [invalid, setInvalid] = useState(false)


    const lockButton = login!="" && password!=""

    const dispatch = useDispatch()
    const submitForm = (e: FormEvent) => {
        e.preventDefault()
        registerUser({login, password}).then((status) => {
            if (status != REGISTER_STATUS.REGISTERED) {
                setInvalid(true)
                setPassword("")
                setRepeatPassword("")
                return
            }
            dispatch(authorize(login))
        })
    }

    const passwordsAreIdentical = password==repeatPassword

    return (
        <><Container className="mt-4 p-4" fluid>
            <h2 className="mb-4">Регистрация</h2>
            <Form onSubmit={submitForm}>
                <FormGroup className='mb-3'>
                    <Form.Label className='text-secondary'>Логин</Form.Label>
                    <Form.Control type='text' isInvalid={invalid} placeholder='Логин' name="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">Имя пользователя уже занято</Form.Control.Feedback>
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Form.Label className='text-secondary'>Пароль</Form.Label>
                    <Form.Control type='password' placeholder='Пароль' name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Form.Label className='text-secondary'>Повторите пароль</Form.Label>
                    <Form.Control isInvalid={!passwordsAreIdentical} type='password' placeholder='Повторите пароль' name="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">Пароли должны быть одинаковы</Form.Control.Feedback>
                </FormGroup>
                <Container fluid className='d-flex justify-content-end p-0'>
                    <Button className='px-3' type={"submit"} disabled={!passwordsAreIdentical||!lockButton}>Зарегистрироваться</Button>
                </Container>
            </Form>
          </Container>
          <Container fluid className='p-0 bg-light py-3 d-flex justify-content-center'>
              <span>Уже есть учетная запись? <Link to={"/login"}>Войти</Link></span>
          </Container></>
    )
}

function RegisterPage() {
    return (
        <AuthTemplate content={<RegisterForm/>}/>
    )
}


export default RegisterPage;