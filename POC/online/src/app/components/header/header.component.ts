import { Component, OnInit } from '@angular/core';
import {DataShareService} from "../../providers/datashare.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
token : boolean =false;
  constructor(private dataShareService :DataShareService) { }
  ngOnInit() {
this.dataShareService.currentMessage.subscribe(data=>{
  if(!!data && data.length >0) {
    this.token = true;
  } else if(!!localStorage.getItem("token")){
    this.token = true;
  }else{
    this.token =false;
  }
})
}
}
