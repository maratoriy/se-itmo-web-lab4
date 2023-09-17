import React, {FormEvent, useEffect, useState} from "react";
import PageHeader from "../components/PageHeader";
import {Button, Card, Container, Form, FormGroup, Table} from "react-bootstrap";
import {Canvas} from "../components/canvas/Canvas"
import {add, clear, get, setDots} from "../api/util";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../api/auth";
import {Result} from "../api/util";
import {drawProxy} from "../components/canvas/util";

function HomePage() {
    const [r, setR] = useState("")
    const [x, setX] = useState("")
    const [y, setY] = useState("")

    const rv = parseInt(r)
    const xv = parseFloat(x)
    const yv = parseFloat(y)

    const invalidX = x==""||xv>5||xv<-5
    const invalidR = r==""||rv>5||rv<1||r.includes(".")
    const invalidY = y==""||yv>5||yv<-5

    const dispatch = useDispatch()
    const submitForm = (e: FormEvent) => {
        e.preventDefault()
        add({r: rv, x: xv, y: yv}).then((data) => {
            let dots = JSON.parse(localStorage.getItem("dots") as string)
            if (dots == null) dots = []
            dots.push({x, y, color: data ? "green" : "red"})
            localStorage.setItem("dots", JSON.stringify(dots))
            get().then((data) => dispatch(setDots(data)))
        })
    }

    const clearHandler = () => {
        localStorage.removeItem("dots");
        clear().then(() => get().then((data) => dispatch(setDots(data))))

    }


    const results: Result[] = useSelector((state: {results: Result[]}) => state.results)


    return (
        <Container fluid className='p-0 d-flex- flex-column'>
            <PageHeader/>
            <Container fluid='md' className='content-container d-flex flex-sm-column flex-lg-row '>
                <Card className={"m-3 p-3 flex-grow-1"}>
                    <Canvas radius={r == ""||invalidR ? "R" : Math.max(Math.min(5, rv), 1)}/>
                </Card>
                <Card className={"m-3"}>
                    <Container fluid className={"h-100 p-5"}>
                        <h2 className="mb-4">Ввод точки</h2>
                        <Form className={"w-100 h-100"} onSubmit={submitForm}>
                            <FormGroup className="mb-2">
                                <Form.Label className='text-secondary'>X</Form.Label>
                                <Form.Control type='number' required isInvalid={invalidX} placeholder='X' name="x" value={x} onChange={(e) => setX(e.target.value)}/>
                                <Form.Control.Feedback type="invalid">Поле пустое или вне интервала</Form.Control.Feedback>
                            </FormGroup>
                            <FormGroup className="mb-2">
                                <Form.Label className='text-secondary'>Y</Form.Label>
                                <Form.Control type='number' required isInvalid={invalidY} placeholder='Y' name="y" value={y} onChange={(e) => setY(e.target.value)}/>
                                <Form.Control.Feedback type="invalid">Поле пустое или вне интервала</Form.Control.Feedback>
                            </FormGroup>
                            <FormGroup className="mb-2">
                                <Form.Label className='text-secondary'>R</Form.Label>
                                <Form.Control type='number' required isInvalid={invalidR} placeholder='R' name="r" value={r} onChange={(e) => setR(e.target.value)}/>
                                <Form.Control.Feedback type="invalid">Поле пустое, вне интервала или нецелое</Form.Control.Feedback>
                            </FormGroup>
                            <Container className={"w-100 d-flex p-0 flex-row-reverse"}>
                                <Button className='px-3' type={"button"} disabled={results.length==0} onClick={() => clearHandler()}>Очистить</Button>
                                <Button className='px-3' type={"submit"} disabled={invalidR||invalidX||invalidX}>Добавить</Button>
                            </Container>
                        </Form>
                    </Container>
                </Card>
            </Container>
            <Card className={"m-3 flex-grow-1"}>
                <Table striped bordered hover size={"md"}>
                    <thead>
                    <tr>
                        <td>Время</td>
                        <td>x</td>
                        <td>y</td>
                        <td>r</td>
                        <td>Попадание</td>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((item: Result, index: number) =>
                        <tr>
                            <td>{new Date(item.date).toUTCString()}</td>
                            <td>{item.x}</td>
                            <td>{item.y}</td>
                            <td>{item.r}</td>
                            <td>{item.hit ? <span className={"text-success"}>Круто</span> : <span className={"text-danger"}>Плохо</span>}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card>
        </Container>
    )
}

export default HomePage;