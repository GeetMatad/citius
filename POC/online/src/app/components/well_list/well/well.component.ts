import {Component, OnInit, ViewChild} from '@angular/core';
export interface userList {
  name: string;
  age: number;
}
const ELEMENT_DATA: userList[] =[
  {
    name : 'Geethashree',
    age : 29
  },
  {
    name : 'Geethashree',
    age : 29

  },
  {
    name : 'Geethashree',
    age : 29
  },
  {
    name : 'Geethashree',
    age : 29

  },
  {
    name : 'Geethashree',
    age : 29
  },
  {
    name : 'Geethashree',
    age : 29

  }];

@Component({
  selector: 'well_details',
  templateUrl: './well.component.html'
})
export class WellComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age'];
  userList = Object.assign([],ELEMENT_DATA)
  ngOnInit() {

  }
}
