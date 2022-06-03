import React from 'react'
import { useAppSelector } from '../redux'

function Home() {

  const token = useAppSelector((state) => state.auth.accessToken)

  return (
    <div>

      <h1>
        Home
      </h1>
  
      {
        token && <p>Logged in!</p>
      }


    </div>
  )
}

export default Home