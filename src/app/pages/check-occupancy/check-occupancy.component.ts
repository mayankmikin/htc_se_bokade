import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-check-occupancy',
  templateUrl: './check-occupancy.component.html',
  styleUrls: ['./check-occupancy.component.scss']
})
export class CheckOccupancyComponent implements OnInit , AfterViewInit {
  closeResult: string;
  PosType:string="";
  successMessage:string;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
   
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            // save button pressed
            console.log(this.PosType);
            if(this.PosType)
            {
              this.successMessage="Saved Successfully";
            }

            this.PosType="";
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
