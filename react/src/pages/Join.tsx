import axios from 'axios'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AuthResponseBody } from '../types'
import { useAppDispatch } from '../redux'
import { setAccessToken } from '../redux/authSlice'

interface Form {
    email: string,
    verifyPassword: string,
    password: string,
    name: string
}

function Join() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { register, handleSubmit, formState: { errors }, watch } = useForm<Form>()  

  const onSubmit: SubmitHandler<Form> = ({ email, password, name }) => {

    axios.post<AuthResponseBody>("/api", { email, password, name })
        .then(({ data }) => {
            dispatch(setAccessToken(data.token))
            navigate("/")
        })
        .catch((e) => {
            alert("Fail! Please try again.")
            console.log(e)
        })

  }

  return (
    <div>
        <h1>Join</h1>

        <form onSubmit={handleSubmit(onSubmit)}>

            <input {...register("name", { required: true })} placeholder="Name" type="text" />

            <input {...register("email", { required: true })} placeholder='Email' type="email"  />

            <input {...register("password", { required: true })} placeholder="Verify Password" type="password" />

            <input {...register("verifyPassword", { required: true, validate: (s) => s === watch("password") })} placeholder="Verify Password" type="password" />

            { errors.verifyPassword && errors.verifyPassword.type === "validate" && <p>Passwords don't match!</p> }

            <button type='submit'>Submit</button>

        </form>


    </div>
  )
}

export default Join