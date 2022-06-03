import { Router } from "express";
import { Request } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import { ParamsDictionary } from 'express-serve-static-core'
import { sendRefreshToken, createToken, validateToken } from './jwt'
import bcrypt from 'bcrypt'
import User from './model'

const router = Router()


/**
 * Create User
 */
 router.post("/", async (req: Request<ParamsDictionary, any, { email: string, password: string, name: string }>, res) => {

    try {
        
        const { email, password, name } = req.body

        //Check if already exists...
        const user = await User.findOne({ email })

        if (user) return res.status(200).json({ message: "User already exists!" })

        const hashed = await bcrypt.hash(password, 10)

        const newUser = await User.create({ email, password: hashed, name })

        //Send Refresh via cookie
        sendRefreshToken(res, newUser.id)

        return res.status(201).json({ token: createToken(newUser.id) })


    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }


})

/**
 * Get User
 */
 router.get("/:id", validateToken, async (req, res) => {

    try {
        const { id } = req.params

        const user = await User.findById(id)

        if (!user) return res.sendStatus(404)

        return res.status(200).json(user)

    } catch (error) {
        return res.sendStatus(500)
    }


})



/**
 * Authenticate
 */
 router.post("/login", async (req: Request<ParamsDictionary, any, { email: string, password: string }>, res) => {

    try {
        
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return res.status(200).json({ message: "No user with credentials" })

        //Compare passwords
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) return res.status(200).json({ message: "Password incorrect." })

        //If valid, provide refresh token and token
        sendRefreshToken(res, user.id)

        return res.status(200).json({ token: createToken(user.id) })


    } catch (error) {
        return res.sendStatus(500)
    }

})


/**
 * Refresh Token
 */
 router.post("/refresh_token", (req, res) => {

    const cookies = req.cookies

    const { jid } = cookies

    if (jid) {
        
        try {
            const payload = verify(jid, process.env.REFRESH_TOKEN_SECRET) as JwtPayload

            sendRefreshToken(res, payload.id)
    
            return res.status(200).json({ token: createToken(payload.id) })

        } catch (error) {
            return res.status(200).json({ token: "" })
        }

    }

    return res.status(200).json({ token: "" })


})

//https://expressjs.com/en/api.html#res.clearCookie
//Note: Cookie options must match those given i.e. httpOnly, secure & samesite
router.post("/logout", validateToken, (_, res) => {

    res.clearCookie("jid", 
    { 
        httpOnly: true, 
        secure: true,
        sameSite: "none"
    }
    )

    return res.sendStatus(200)
})

export default router