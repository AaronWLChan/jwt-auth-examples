# Angular
This project uses Angular 13.

Libraries Used:
* @auth0/angular-jwt

## Where do I store tokens?
The access token is stored in memory in a service named `AuthService`, whereas the refresh token is stored as a cookie.

## How do I handle page reload?
You will need to send a request to the backend through the `refresh_token` endpoint whenever the app is initialized.
In Angular, this can be done by providing a `APP_INITIALIZER` function.
```typescript
// app.module.ts
function init(authService: AuthService){
  return () => firstValueFrom(authService.refreshToken())
}

@NgModule({
  declarations: [...],
  imports: [...],
  providers: [
    { provide: APP_INITIALIZER, useFactory: init, multi: true, deps: [AuthService] }, // Add Initializer function here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

```

## How do I handle authorized routes?
To handle authorized routes you will need to create a `guard` which implements `canActivate`.
```typescript
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          if (!this.authService.isAuthenticated){
            return this.router.navigateByUrl("/login")
          } 
          return true;
  }
}

```

## How do I make authenticated requests?
To make authenticated requests you will need to use an `interceptor`. 
```typescript
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
```

## How do I handle logout?
To clear the JWT cookie, you will need send a request to the backend through the `logout` endpoint.
```typescript
// app.component.ts
  logout(){
    this.authService.logout()
      .subscribe(() => {
        this.authService.setToken(undefined)
        localStorage.setItem("logout", "1")
      })
  }
```

### Log out all tabs
To logout out of all tabs you will need to implement an event listener which listens to changes in `LocalStorage`. 

In Angular, you can use a `HostListener` to achieve this.
```typescript
//app.component.ts
  @HostListener("window.storage", ["$event"])
  handleLogout(e: StorageEvent){
    if (e.key === "logout"){
      this.authService.setToken(undefined)
    }
  }
```
