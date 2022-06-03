import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateResponseBody, JWTPayload, User } from '../types';
import { JwtHelperService } from '@auth0/angular-jwt'
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token?: string

  private jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  authenticate(email: string, password: string){
    return this.http.post<AuthenticateResponseBody>("/api/login", { email, password }, { withCredentials: true })

  }

  join(email: string, password: string){
    return this.http.post<AuthenticateResponseBody>("/api", { email, password })
  }
  
  logout(){
    return this.http.post("/api/logout", undefined, { responseType: "text" })
  }

  getCurrentUser(){
    return this.http.get<User>(`/api/${this.getId}`)
  }

  setToken(token?: string){
    this.token =  token
  }

  get getToken(){
    return this.token
  }

  get isAuthenticated(){
    return !!this.token
  }

  get isTokenExpired(){
    return this.jwtService.isTokenExpired(this.token)
  }

  get getId(){
    return this.jwtService.decodeToken<JWTPayload>(this.token).id
  }

  refreshToken(){
    return this.http.post<AuthenticateResponseBody>("/api/refresh_token", undefined, { withCredentials: true })
          .pipe(
            map((data) => {
              this.token = data.token
              return data.token
            })
          )
  }

}
