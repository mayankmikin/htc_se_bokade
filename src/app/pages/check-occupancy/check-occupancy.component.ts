import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from 'app/services/firestore.service';
import { Store } from 'app/models/store';
@Component({
  selector: 'app-check-occupancy',
  templateUrl: './check-occupancy.component.html',
  styleUrls: ['./check-occupancy.component.scss']
})
export class CheckOccupancyComponent implements OnInit , AfterViewInit {
  closeResult: string;
  PosType:number;
  successMessage:string;
  shop:Store;
  errormessage:string="  is not Registered !"
  showerror=false;

  @ViewChild('content',{static: false})
  private template: TemplateRef<any>;
  constructor(private modalService: NgbModal,
    private firestoreService : FirestoreService,
    ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
   this.open(this.template);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            // save button pressed
            console.log(this.PosType);
            if(this.PosType)
            {
              this.checkShopIsRegistered(this.PosType);
             // this.successMessage="Saved Successfully";
            }

           // this.PosType="";
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

  checkShopIsRegistered(id:number)
  {
    this.firestoreService.getById(id.toString()).then(data => {
      if(data.exists)
      {
        console.log('found in firestore')
        var s=data.data() as Store
        console.log()
        if(this.shop.organisasjonsnummer!=s.organisasjonsnummer)
        {
          this.showerror=true
        }
      }
      else{
        this.showerror=true
      }
    });
  }

}
