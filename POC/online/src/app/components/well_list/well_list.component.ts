import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {WellComponent} from "./well/well.component";
export interface wellList {
  name: string;
  type : string,
  source :string
}

const ELEMENT_DATA: wellList[] =[
  {
    name : 'TestRLSWell01',
    type : 'rls',
    source :'100001'
  },
  {
    name : 'TestESPWell01',
    type : 'esp',
    source :'100001'
  },
  {
    name : 'TestRLSWell01',
    type : 'rls',
    source :'100001'
  },
  {
    name : 'TestESPWell01',
    type : 'esp',
    source :'100001'
  },
  {
    name : 'newrlswell',
    type : 'rls',
    source :'10000101'
  },];

@Component({
  selector: 'well_list',
  templateUrl: './well_list.component.html'
})
export class WellListComponent implements OnInit,AfterViewInit {
  @ViewChild(WellComponent,{static :false}) child :WellComponent;
  // get child reference
  @ViewChild('srcKey',{static :false}) sk: ElementRef; // get parent template reference
  sourceId :string;
 constructor(){ }
  message:string;
  wellList = Object.assign([],ELEMENT_DATA);
  showChild :boolean =false;
  ngOnInit() {
    let length = this.wellList.length-1;
    this.sourceId = this.wellList[length]['source'];
  }
  ngAfterViewInit() {
    this.sk.nativeElement.innerHTML =  this.sk.nativeElement.value;
  }
  openAddWell(event){
    this.sourceId = event.target.value;
    this.sk.nativeElement.innerHTML =  event.target.value;
    this.showChild= true;
  }

  receiveDetails (event){
    if(!!event){
      this.wellList.push(event);
    }
  }


}

