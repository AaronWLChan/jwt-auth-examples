import React, { useEffect, useState } from 'react'
import { User } from '../types'
import _axios from '../axios'
import { getUserId } from '../util'
import { useAppSelector } from '../redux'

function AuthOnly() {

  const token = useAppSelector((state) => state.auth.accessToken)
  const [user, setUser] = useState<User>()
  const [pageState, setPageState] = useState<"loading" | "error" | "success">("loading")

  useEffect(() => {

    _axios.get<User>(`/api/${getUserId(token)}`)
        .then(({ data }) => {

          setUser(data)
          setPageState("success")
        })
        .catch((e) => {
          
          setPageState("error")
          console.log(e)
        })

  }, [])


  if (pageState === "error"){
    return <div>Error!</div>
  }

  if (pageState === "loading"){
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Auth Only!</h1>

      <ul>
       <li>{`Id: ${user?._id}`}</li>
       <li>{`Email: ${user?.email}`}</li>
       <li>{`Name: ${user?.name}`}</li> 
      </ul>
      

    </div>
  )
}

export default AuthOnly