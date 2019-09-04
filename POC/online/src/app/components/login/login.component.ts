import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AccountService} from "../../providers/account.service";
import {DataShareService} from "../../providers/datashare.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  submitted: boolean = false;
  displayError ={ };
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private accountService :AccountService,
              private dataShareService :DataShareService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.dataShareService.currentMessage.subscribe(data=>
    this.displayError = Object.assign({},data))
  }
  login()  {
    this.submitted = true;
    if (this.loginForm.valid) {
 this.accountService.login(this.loginForm.value).subscribe(data=>{
  if(data.status=== 200 && !!data.success){
    localStorage.setItem('token',data.content.userContext);
    this.dataShareService.updateData(data.content.userContext ,'Msg')
    this.router.navigate(['/user-list'])
  } else{
    this.displayError ={
      display :true,
      message : data.message
    }
  }
 })
    } else {
      this.displayError ={
        display :true,
        message : 'Please enter a valid credentials'
      }
      }
    }
}
