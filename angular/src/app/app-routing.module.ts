import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthOnlyComponent } from './auth-only/auth-only.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { JoinComponent } from './join/join.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  { path: "auth-only", component: AuthOnlyComponent, canActivate: [AuthGuard]},
  { path: "login", component: LoginComponent },
  { path: "join", component: JoinComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
