import axios from "axios";
import {AUTHORIZATION_STATUS, getToken, REGISTER_STATUS} from "./auth";
import {StatusCode} from "status-code-enum";
import {createSlice} from "@reduxjs/toolkit";

const apiUrl: string = "http://localhost:8080/"

export function mapUrl(url: string) {
    return apiUrl+url;
}

axios.defaults.headers.post['Content-Type'] = 'application/json'


export interface Result {
    id: number,
    date: number,
    x: number,
    y: number,
    r: number
    hit: boolean,
}

const resultsSlice = createSlice({
    name: 'results',
    initialState: [],
    reducers: {
        setDots(state, action) {
            return action.payload
        },
    }
})

export default resultsSlice.reducer
export const {setDots} = resultsSlice.actions

export async function add(dot: {x: number, y: number, r: number}) {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
    };
    try {
        const res = await axios.post(mapUrl("add"), JSON.stringify(dot), config)
        return res.data
    }
    catch(error: any) {
        return []
    }
}

export async function get() {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
    };
    console.log(config)
    try {
        const res = await axios.post(mapUrl("get"), {}, config)
        return res.data
    }
    catch(error: any) {
        return []
    }
}

export async function clear() {
    const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
    };
    console.log(config)
    try {
        const res = await axios.post(mapUrl("clear"), {}, config)
    }
    catch(error: any) {
        return []
    }
}
