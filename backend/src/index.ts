import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes'

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id?: string
    }
}

dotenv.config()

const PORT = process.env.PORT || 4000

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())
app.use(cookieparser())
app.use(routes)

//Connect to DB
mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})
