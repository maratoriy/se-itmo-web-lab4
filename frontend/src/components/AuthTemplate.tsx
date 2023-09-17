import React from "react";
import {Button, Card, Container, Form, FormGroup, FormLabel, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../resources/icon.png"

function LoginPage(props: {content: JSX.Element}) {
    return (
        <Container className='vh-100 justify-content-center' fluid>
            <Row className='py-5 align-items-center justify-content-center min-vh-100 flex-column flex-nowrap bg-primary'>
                <Image src={logo} style={{width: 160}} className="mb-5"/>
                <Card className='mx-auto auth-card border-0 rounded-1 shadow-lg'>
                    {props.content}
                </Card>
            </Row>
        </Container>
    )
}

export default LoginPage;