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
//No interception
async function refreshAccessToken(){

    return axios.post<AuthResponseBody>("/api/refresh_token", undefined, { withCredentials: true })
        .then(({ data }) => {

            store.dispatch(setAccessToken(data.token))

            return data.token
        })
}


export default instance