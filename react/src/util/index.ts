import jwtDecode, { JwtPayload } from "jwt-decode"

export function getUserId(token?: string){

    let id: string | undefined = undefined

    if (token){

        let decoded = jwtDecode<JwtPayload>(token)

        id = decoded.id
    }

    return id
}

export function isTokenExpired(token?: string){

    if (token){

        let decoded = jwtDecode<JwtPayload>(token)

        return new Date().getTime() > (decoded.exp! * 1000)

    }

    return false

}