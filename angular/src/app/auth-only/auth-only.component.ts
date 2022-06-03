import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../types';

@Component({
  selector: 'app-auth-only',
  templateUrl: './auth-only.component.html',
  styleUrls: ['./auth-only.component.css']
})
export class AuthOnlyComponent implements OnInit, OnDestroy {

  user?: User
  private subscription?: Subscription

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUser()
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  getUser(){
    return this.authService.getCurrentUser()
      .pipe(
        catchError((e) => { throw new Error("Failed to get user! Error: " + e) })
      )
      .subscribe((user) => this.user = user)
  }

}
