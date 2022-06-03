import axios from 'axios'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import { useAppDispatch } from './redux'
import { setAccessToken } from './redux/authSlice'
import Routes from './Routes'
import { AuthResponseBody } from './types'

function App() {

  const dispatch = useAppDispatch()

  const [pageState, setPageState] = useState<"loading" | "success" | "error">("loading")

  /**
   * Handles logout across tabs
   */
  useEffect(() => {

    const handleLogout = (e: StorageEvent) => {

      if (e.key === "logout"){
        dispatch(setAccessToken(""))
      }

    }

    window.addEventListener("storage", handleLogout)

    return () => window.removeEventListener("storage", handleLogout)

  }, [])

  /**
   * Handles token refresh on app reload
   */
  useEffect(() => {

    axios.post<AuthResponseBody>("/api/refresh_token", undefined, { withCredentials: true })
      .then(({ data }) => {
        dispatch(setAccessToken(data.token))
        setPageState("success")
      })
      .catch((e) => {
        console.log("Could not connect to backend. Error: " + e)
        setPageState("error")
      })

      
  },[])

  if (pageState === "error"){
    return <div>Error connecting to backend.</div>
  }

  if (pageState === "loading"){
    return null
  }

  return (
    <div className="App">
        <Layout>
          <Routes/>
        </Layout>
    </div>
  )
}

export default App
