import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.authService.isAuthenticated){

      if (this.authService.isTokenExpired){
        return this.handleRefresh(request, next)
      }

      return next.handle(request.clone({ headers: request.headers.set("Authorization", `Bearer ${this.authService.getToken}`), }))

    }

    return next.handle(request);
  }

  handleRefresh(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>{

    return this.authService.refreshToken()
      .pipe(
        switchMap((token) => {

          this.authService.setToken(token)
         
          return next.handle(request.clone({ headers: request.headers.set("Authorization", `Bearer ${token}`) }))
        })
      )

  }

}
