import axios from "axios";
import {mapUrl} from "./util";
import {StatusCode} from "status-code-enum";
import {createSlice} from "@reduxjs/toolkit";

export enum AUTHORIZATION_STATUS {
    AUTHORIZED,
    UNATHORIZED
}

export interface User {
    status: AUTHORIZATION_STATUS
    name?: string;
}

const UNAUTHORISED_USER: User = {
    status: AUTHORIZATION_STATUS.UNATHORIZED
}


export enum REGISTER_STATUS {
    REGISTERED,
    INVALID_USER,
    REGISTER_ERROR
}

export enum LOGIN_STATUS {
    LOGIN_OK,
    INVALID_CREDENTIALS,
    LOGIN_ERROR
}


function setToken(token: string) {
    localStorage.setItem("token", token)
}

export function getToken(): string | null {
    return localStorage.getItem("token")
}

function clearToken() {
    const token: string | null = getToken();
    if (typeof token === "string")
        localStorage.removeItem(token);

}


export async function registerUser(credentials: { login: string, password: string }): Promise<REGISTER_STATUS> {
    try {
        const res = await axios.post(mapUrl("register"), JSON.stringify(credentials))
        setToken(res.data.token);
        return REGISTER_STATUS.REGISTERED;
    }
    catch(error: any) {
        if (error.response.status == StatusCode.ClientErrorConflict)
            return REGISTER_STATUS.INVALID_USER;
        return REGISTER_STATUS.REGISTER_ERROR
    }
}

export async function loginUser(credentials: { login: string, password: string }): Promise<LOGIN_STATUS> {
    try {
        const res = await axios.post(mapUrl("login"), JSON.stringify(credentials))
        setToken(res.data.token);
        return LOGIN_STATUS.LOGIN_OK;
    } catch(error: any) {
        if (error.response.status == StatusCode.ClientErrorUnauthorized)
            return LOGIN_STATUS.INVALID_CREDENTIALS
        return LOGIN_STATUS.LOGIN_ERROR
    }
}

export function exitUser() {
    clearToken()
}



const userSlice = createSlice({
    name: 'user',
    initialState:() => {
        const login: string | null = localStorage.getItem("login")
        if(login==null)
            return UNAUTHORISED_USER;
        return {
            status: AUTHORIZATION_STATUS.AUTHORIZED,
            name: login
        }
    },
    reducers: {
        authorize(state, action) {
            const login: string = action.payload
            localStorage.setItem("login", login)
            return {
                status: AUTHORIZATION_STATUS.AUTHORIZED,
                name: login
            }
        },
        unauthorize(state, action) {
            localStorage.removeItem("login")
            return UNAUTHORISED_USER
        }
    }
})

export default userSlice.reducer
export const {authorize, unauthorize} = userSlice.actions