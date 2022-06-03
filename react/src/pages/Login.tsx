import axios from 'axios'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../redux'
import { setAccessToken } from '../redux/authSlice'
import { AuthResponseBody } from '../types'

interface Form {
    email: string,
    password: string
}

function Login() {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const { register, handleSubmit } = useForm<Form>()

    const onSubmit: SubmitHandler<Form> = (data) => {

        axios.post<AuthResponseBody>("/api/login", data)
            .then(({data}) => {

                console.log("Logged in!")
                console.log(data)
                
                dispatch(setAccessToken(data.token))
                navigate("/auth-only")
            })
            .catch((e) => {
                alert("Failed to login. Try again.")
                console.log(e)
            })

    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit(onSubmit)}>

                <input {...register("email", { required: true })} placeholder='Email' type="email"  />

                <input {...register("password", { required: true })} placeholder="Password" type="password" />

                <button type='submit'>Submit</button>

            </form>
        </div>
  )
}

export default Login