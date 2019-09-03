import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  currentDate: string;
  ngOnInit() {
   var date = new Date();
    var   newdate = date.toDateString();
   this.currentDate = newdate
  }
}
