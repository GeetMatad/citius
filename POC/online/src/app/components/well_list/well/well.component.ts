import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AccountService} from "../../../providers/account.service";
import {DataShareService} from "../../../providers/datashare.service";
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
export class WellComponent implements OnInit,OnChanges {
  @ViewChild('sourceKeyInput', {static: false}) srcKeyInput: ElementRef;
  @Input() fromSource : string;
  @Output() wellDetails = new EventEmitter<any>();
  addForm: FormGroup;
  submitted: boolean = false;
  displayError ={ };
  souceid;
  constructor(private router: Router,
              private formBuilder: FormBuilder) {
    this.addForm= this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      source: ['', Validators.required],
    });
  }
  ngOnChanges() {
    if(!!this.fromSource) {
      this.souceid = this.fromSource;
      if(!!this.srcKeyInput)
      this.srcKeyInput.nativeElement.value = this.souceid;
    }
  }
  ngOnInit() {
    this.addForm.patchValue({source : this.souceid})
  }
  addWellList(){
    this.submitted= true;
    if(this.addForm.valid){
    let addDetails = Object.assign({}, this.addForm.value)
      this.wellDetails.emit(addDetails);
    this.addForm.patchValue({name :null,type :null,source : this.souceid})
      this.submitted= false;
    }
  }
}

