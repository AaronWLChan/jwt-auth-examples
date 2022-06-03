# React
This project was created with Vite.

Libraries used:
* Axios
* jwt-decode
* react-redux
* @redux-js/toolkit
* react-hook-form
* react-router-dom@6

## Where do I store tokens?
The access token is stored in memory using Redux, whereas the refresh token is stored as a cookie.

## How do I handle page reload?
Add a `useEffect` to trigger on `App` mount. Ensure when calling the refresh token endpoint add `withCredential: true` to pass along an existing refresh token.
```typescript
/// App.tsx
useEffect(() => {
    axios.post("/api/refresh_token", undefined, { withCredentials: true })
        .then(({ data }) => {
            dispatch(setAccessToken(data.token))
        })
}, [])
```

## How do I handle authorized routes?
When using `react-router-dom` you can create a protected route component as seen below:
```typescript
// ProtectedRoute.tsx
import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../redux'

interface ProtectedRouteProps {
  redirectTo?: string
}

function ProtectedRoute({ redirectTo }: ProtectedRouteProps) {

  const loggedIn = useAppSelector((state) => state.auth.accessToken)

  return (
    loggedIn ? <Outlet/> : <Navigate to={redirectTo ? redirectTo : "/"} replace />
  )
}

export default ProtectedRoute
```

You can then use the component as an element when defining routes.
```typescript
// Routes.tsx
<Routes>
    <Route path="/auth-only" element={<ProtectedRoute redirectTo="/login" />} >
        <Route path="/auth-only" element={<AuthOnly/>} />
    </Route>
    // ... Other routes
<Routes>
```

## How do I make authenticated requests?
Create a new `axios` instance that intercepts requests. Use this `axios` instance whenever you need to make an authenticated request.
```typescript
import axios from "axios"
import { Store } from "../redux"
import { setAccessToken } from "../redux/authSlice"
import { AuthResponseBody } from "../types"
import { isTokenExpired } from "../util"

let store: Store

//Inject in main.tsx || index.tsx
export const injectStore = (_store: Store) => {
    store = _store
}

const instance = axios.create()

//Intercept requests and ensure token is valid
instance.interceptors.request.use( async (res) => {

    if (!res.headers) res.headers = {}
    
    let token = store.getState().auth.accessToken

    if (token){

        if (isTokenExpired(token)){
            //Refresh token
            token = await refreshAccessToken() 
        }

        res.headers['Authorization'] = `Bearer ${token}`
    }

    //If user has not logged in yet, return as normal
    return res

}, (err) => {
    return Promise.reject(err)
})

//Calls backend -> New Token --> Save to Session
async function refreshAccessToken(){

    return axios.post<AuthResponseBody>("/api/refresh_token", undefined, { withCredentials: true })
        .then(({ data }) => {

            store.dispatch(setAccessToken(data.token))

            return data.token
        })
}

export default instance
```
To access `redux` store in the interceptor you will need to inject the store in your project's entry point file - Main.tsx (Vite).

```typescript
// axios/index.ts
let store: Store

export const injectStore = (_store: Store) => {
    store = _store
}

// Main.tsx
import { store } from './redux'
injectStore(store)
```

## How do I handle logout?
To clear the JWT cookie, you will need send a request to the backend through the `logout` endpoint then dispatch a `logout` event to Redux.
```typescript
// Header.tsx
  const logout = () => {
    _axios.post("/api/logout", undefined)
        .then(() => {
            dispatch(setAccessToken(""))
            localStorage.setItem("logout", "1")
        })
        .catch((e) => {
            console.log(e)
            alert("Failed to log out")
        })
  }
```
### Log out all tabs
To logout out of all tabs you will need to implement an event listener which listens to changes in `LocalStorage`.
```typescript
// App.tsx
  useEffect(() => {
    const handleLogout = (e: StorageEvent) => {
      if (e.key === "logout"){
        dispatch(logout())
      }
    }

    window.addEventListener("storage", handleLogout)

    return () => window.removeEventListener("storage", handleLogout)

  }, [])
```