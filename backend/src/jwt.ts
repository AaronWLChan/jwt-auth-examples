import { NextFunction, Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";


export function createToken(id: string){
    return sign({ id }, process.env.TOKEN_SECRET, { expiresIn: "10m" })

}

//https://medium.com/swlh/7-keys-to-the-mystery-of-a-missing-cookie-fdf22b012f09
export function sendRefreshToken(res: Response, id: string){
    res.cookie("jid", sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }), 
        { 
            httpOnly: true, 
            secure: true,
            sameSite: "none"
        }
    )
}

export function validateToken(req: Request, res: Response, next: NextFunction){

    const authHeader = req.headers.authorization

    if (!authHeader) return res.sendStatus(401)

    const token = authHeader.split(" ")[1]

    if (!token) return res.sendStatus(401)

    try {
        jwt.verify(token, process.env.TOKEN_SECRET)
        next()
    } catch (error) {
        return res.sendStatus(401)
    }

}