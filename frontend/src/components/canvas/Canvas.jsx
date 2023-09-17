import React, {useEffect, useState} from "react";
import {SquareCanvas} from "./util";
import {add, setDots, get} from "../../api/util";
import {useDispatch} from "react-redux";



export function Canvas(props) {
    const [st, setSt] = useState(null)
    let myAttr = {'radius': `${props.radius}`}

    function draw() {
        let sc = new SquareCanvas("#graph");
        let r = props.radius
        const rd = 40
        const rd2 = rd / 2;
        const c = 50
        const ed = 100

        sc.updateArea();
        sc.ctx.lineWidth = 3;
        sc.shape("#9B6EDE", "#453163",
            c, c,
            {type: "lineTo", x: c, y: c + rd},
            {type: "lineTo", x: c + rd2, y: c + rd},
            {type: "lineTo", x: c + rd2, y: c},
            {type: "lineTo", x: c, y: c - rd2},
            {type: "lineTo", x: c, y: c - rd},
            {type: "arcTo", x1: c - rd, y1: c - rd, x2: c - rd, y2: c, radius: rd},
            {type: "lineTo", x: c, y: c}
        )
        sc.ctx.lineWidth = 1;
        sc.ctx.fillStyle = "black"
        sc.ctx.strokeStyle = "black"

        let rLabel = (isNaN(r / 1)) ? "R" : r;
        let r2Label = (isNaN(r / 2)) ? "R/2" : r / 2;

        sc.line(0, c, ed, c); // Ox
        sc.line(c, 0, c, ed); // Oy

        sc.line(c - rd, c - 1.5, c - rd, c + 1.5); // | -R
        sc.fillText(`-${rLabel}`, c - rd + 1, c - 1.5, 0.8);

        sc.line(c - rd2, c - 1.5, c - rd2, c + 1.5); // | -R/2
        sc.fillText(`-${r2Label}`, c - rd2 + 1, c - 1.5, 0.8);

        sc.line(c + rd, c - 1.5, c + rd, c + 1.5); // | R
        sc.fillText(`${rLabel}`, c + rd + 1, c - 1.5, 0.8);

        sc.line(c + rd2, c - 1.5, c + rd2, c + 1.5); // | R/2
        sc.fillText(`${r2Label}`, 71, c - 1.5, 0.8);

        sc.line(c - 1.5, c - rd, c + 1.5, c - rd); // - R
        sc.fillText(`${rLabel}`, c + 2, c - rd + 1, 0.8);

        sc.line(c - 1.5, c - rd2, c + 1.5, c - rd2); // - R/2
        sc.fillText(`${r2Label}`, c + 2, c - rd2 + 1, 0.8);

        sc.line(c - 1.5, c + rd2, c + 1.5, c + rd2); // - -R/2
        sc.fillText(`-${r2Label}`, c + 2, 71, 0.8);


        sc.line(c - 1.5, c + rd, c + 1.5, c + rd); // - -R
        sc.fillText(`-${rLabel}`, c + 2, c + rd + 1, 0.8);

        sc.line(c - 1.5, 3, c, 0);  // /\
        sc.line(c + 1.5, 3, c, 0);  // ||
        sc.fillText("y", c - 5, 4);

        sc.line(97, c + 1.5, ed, c);
        sc.line(97, 48.5, ed, c); // ->
        sc.fillText("x", ed - 5, c - 3);

        let dots = JSON.parse(localStorage.getItem("dots"))
        if (dots == null) dots = []
        if (!isNaN(r))
            dots.forEach((dot, index) => {
                //console.log(dot)
                let x = (4 / 10 * dot.x / r + 0.5) * 100
                let y = -(4 / 10 * dot.y / r - 0.5) * 100
                sc.ctx.fillStyle = dot.color
                sc.ctx.strokeStyle = dot.color
                sc.fillText(`${dots.length - index}`, x, y, 0.8);
                sc.dot(x, y, dot.color)
            })
    }

    const dispatch = useDispatch()
    useEffect(() => {
        let sc = st
        if(sc==null) {
            sc = new SquareCanvas("#graph");
            setSt(sc)
        }
        sc.onclick = (e) => {
            let r = props.radius
            if (!isNaN(r)) {
                console.log(e)
                let color
                let x = (e.x / 100 - 0.5) * 10 / 4 * r
                let y = (-e.y / 100 + 0.5) * 10 / 4 * r


                add({x, y, r}).then((data) => {
                    let dots = JSON.parse(localStorage.getItem("dots"))
                    if (dots == null) dots = []
                    dots.push({x, y, color: data ? "green" : "red"})
                    localStorage.setItem("dots", JSON.stringify(dots))
                    draw(st)
                    get().then((data) => dispatch(setDots(data)))
                })
            }
        }
        draw(sc)
    })

    return (<canvas width={450} height={450}  id={"graph"} {...myAttr}/>)
}