import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private logoutSubscription?: Subscription

  constructor(public authService: AuthService, private router: Router){}

  ngOnDestroy(): void {

    //Remove subscriptions
    if(this.logoutSubscription) this.logoutSubscription.unsubscribe()

  }

  @HostListener("window:storage", ['$event'])
  handleLogout(e: StorageEvent){

    if (e.key === "logout"){
      this.authService.setToken(undefined)

      if (this.router.url === "/auth-only") this.router.navigateByUrl("/")

    }
  }

  logout(){

    this.logoutSubscription = this.authService.logout()
        .subscribe(() => {

          this.authService.setToken(undefined)
          localStorage.setItem("logout", "1")

          if (this.router.url === "/auth-only") this.router.navigateByUrl("/")

        })
  }



}
