import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm:FormGroup;
  submitted : boolean = false;
  constructor(private router: Router,private formBuilder :FormBuilder) { }

  ngOnInit() {
    this.loginForm= this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  login()  {
    this.submitted = true;
    if (this.loginForm.valid) {
        this.router.navigate(["user"]);
      } else {
        alert("Invalid credentials");
      }
    }
}
