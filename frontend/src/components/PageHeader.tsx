import React from "react";
import {Button, Card, Container, Form, Navbar, Offcanvas, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {exitUser, unauthorize, User} from "../api/auth"
import './components.scss'
import NavbarOffcanvas from "react-bootstrap/NavbarOffcanvas";
import {behaviorPlugin} from "@testing-library/user-event/dist/keyboard/types";
import {PersonCircle} from "react-bootstrap-icons";
import {AUTHORIZATION_STATUS} from "../api/auth";

const authorLabel: string = "Киушкин А. Э. Вариант: 89342"

function UserCard(props: {user: User | undefined}) {
    return (
        <Container fluid className='d-flex align-items-baseline px-0 my-auto'>
            <PersonCircle className='align-self-center text-primary' size='32'/>
            <span className='text-primary ms-md-2 mx-auto my-auto'>{props.user?.name}</span>
        </Container>
    )
}

function OffCanvasCard(props: {id: string, user: User}) {
    const authorized: boolean = props.user.status === AUTHORIZATION_STATUS.AUTHORIZED

    const dispatch = useDispatch()
    const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        exitUser()
        dispatch(unauthorize({}))
    }

    return (
        <Navbar.Offcanvas
            id={props.id}
            placement = {'start'}
            className='mw-25'
        >
            <Offcanvas.Header closeButton className='text-primary'>
                <Offcanvas.Title className='container-fluid'>{authorized ? <UserCard user={props.user}/> : 'Не авторизован'}</Offcanvas.Title>
            </Offcanvas.Header>
            {authorized ? <Button variant='outline-primary' className='w-100 rounded-0 border-start-0 border-end-0' onClick={(e) => handleExit(e)}>Выйти</Button> : ''}
            <Offcanvas.Body className='d-flex flex-column-reverse'>
                <Container fluid>
                    {authorLabel}
                </Container>
            </Offcanvas.Body>
        </Navbar.Offcanvas>
    )
}

function NavbarUserCard(props: {user: User }) {
    const dispatch = useDispatch()
    const handleExit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        exitUser()
        dispatch(unauthorize({}))
    }

    return (
        <Form className='d-none d-md-flex align-items-baseline'>
            <Card bg='light' color='light' className='align-self-center'>
                <Container fluid className='d-flex align-items-baseline py-1'>
                    <UserCard user={props.user}/>
                    <Button variant='primary' className='ms-3' onClick={(e) => handleExit(e)}>Выйти</Button>
                </Container>
            </Card>
        </Form>
    )
}

function PageHeader() {
    const user: User = useSelector((state: {user: User}) => state.user);
    const authorized: boolean = user.status === AUTHORIZATION_STATUS.AUTHORIZED

    return (
        <Navbar bg='primary' expand="false" className="mb-3 navbar-dark shadow-lg" >
            <Container fluid >
                <Navbar.Toggle
                    aria-controls={'navbar-offcanvas'}
                    className = 'navbar-offcanvas-toggler'
                />
                <Navbar.Brand className='text-light mx-auto me-md-0 ms-md-3'>
                    <h3>Web. Lab4</h3>
                </Navbar.Brand>

                <Navbar.Text className='d-none d-md-block text-light'>{authorLabel}</Navbar.Text>
                {authorized ? <NavbarUserCard user={user}/> : ''}
                <OffCanvasCard id={'navbar-offcanvas'} user={user}/>
            </Container>
        </Navbar>
    )
}

export default PageHeader;