import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
  selector: 'button-view',
  template: `
  <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-primary" (click)="register()">
      Register Shop <i class="fa fa-clipboard"></i></button>
      <button type="button" class="btn btn-info" (click)="check()">
      Check Info <i class="fa fa-info-circle"></i></button>
      </div>

  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }


  register() {
    console.log('register', this.rowData.organisasjonsnummer);
    this.save.emit(this.getObj('register'));
    this.router.navigate(['/register', this.rowData.organisasjonsnummer]);
  }
  check() {
    console.log('checking', this.rowData.organisasjonsnummer);
    this.save.emit(this.getObj('check'));
    this.router.navigate(['/check', this.rowData.organisasjonsnummer]);
  }

  getObj(type:string)
  {
   return {
        "type": type,
        "data":this.rowData
    }
  }

  constructor(private router:Router)
  {
    
  }
  
}