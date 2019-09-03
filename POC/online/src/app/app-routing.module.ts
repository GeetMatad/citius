import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {UserListComponent} from "./components/user/userlist.component";
import {WellListComponent} from "./components/well_list/well_list.component";


const AppRoutes: Routes = [
  {path:'home',component: HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'user-list',component: UserListComponent},
  {path:'well-list',component: WellListComponent},
  {path :'**', redirectTo: 'home'},
];


@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
