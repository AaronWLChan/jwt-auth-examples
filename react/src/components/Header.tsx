import React from 'react'
import { Link } from 'react-router-dom'
import _axios from '../axios'
import { useAppDispatch, useAppSelector } from '../redux'
import { setAccessToken } from '../redux/authSlice'

function Header() {

  const loggedIn = useAppSelector((state) => state.auth.accessToken)
  const dispatch = useAppDispatch()

  const logout = () => {
    
    _axios.post("/api/logout")
      .then(() => {

        dispatch(setAccessToken(""))
        localStorage.setItem("logout", "1")

      })
      .catch((e) => {
        alert("Failed to logout!")
        console.log(e)
      })

  }

  return (
    <div>
      <ul>
          <li><Link to="/">Home</Link></li>
        {
          loggedIn ?
          <>
            <li><Link to="/auth-only">Auth Only</Link></li>
            <li><button type='button' onClick={logout}>Logout</button></li>
          </>
          :
          <>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/join'>Join</Link></li>
          </>
        }
      </ul>
    </div>
  )
}

export default Header