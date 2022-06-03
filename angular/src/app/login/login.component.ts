import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

interface Form{
  email: string,
  password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  })

  private subscription?: Subscription

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }

  onSubmit(){

    const { email, password } = this.form.value as Form

    this.subscription = this.authService.authenticate(email, password)
    .pipe(
      catchError((error) => { throw new Error("Failed to authenticate! Error: " + error) })
    )
    .subscribe(({ token }) => {
        this.authService.setToken(token)
        this.router.navigateByUrl("/auth-only")
    })

  }

}
