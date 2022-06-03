import { JwtPayload } from "jwt-decode"

export interface AuthResponseBody {
    token: string
}

export interface User {
    _id: string,
    email: string,
    name: string,
}

declare module "jwt-decode"{
    interface JwtPayload {
        id?: string
    }
}
