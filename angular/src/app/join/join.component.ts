import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

interface Form{
  email: string,
  password: string,
  verifyPassword: string
}

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit, OnDestroy {

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    verifyPassword: [''],
  }, { validators: passwordMatchesValidator })

  private subscription?: Subscription


  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()

  }

  onSubmit(){

    const { email, password } = this.form.value as Form

    this.subscription = this.authService.join(email, password)
      .pipe(
        catchError((error) => { throw new Error("Failed to create! Error: " + error) })
      )
      .subscribe(({ token }) => {
          this.authService.setToken(token)
          this.router.navigateByUrl("/auth-only")
      })

  }



}

const passwordMatchesValidator: ValidatorFn = (control: AbstractControl) => {

  const password = control.get("password")
  const verifyPassword = control.get("verifyPassword")

  const result = password && verifyPassword && password.value === verifyPassword.value ? null : { matches: false }

  console.log("Result: " + result)

  return result
}