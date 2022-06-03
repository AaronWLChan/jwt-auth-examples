export interface JWTPayload {
    id: string,
    exp: number
}

export interface AuthenticateResponseBody{
    token: string,
}


export interface User {
    _id: string,
    email: string,
    name: string
}