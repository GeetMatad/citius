import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UserListComponent} from "./components/user/userlist.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {WellComponent} from "./components/well_list/well/well.component";
import {WellListComponent} from "./components/well_list/well_list.component";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    UserListComponent,
    DashboardComponent,
    WellListComponent,
    WellComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
