import { model, Schema } from "mongoose";

interface IUser {
    email: string,
    password: string,
    name: string
}

const schema = new Schema<IUser>({
    email: { type: "String", required: true },
    password: { type: "String", required: true },
    name: { type: "String", required: true },
})

export default model<IUser>("User", schema)