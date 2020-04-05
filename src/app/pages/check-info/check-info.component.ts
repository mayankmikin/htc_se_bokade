import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from 'app/service/search.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'app/services/firestore.service';
import { Enheter } from 'app/models/result';
import { Store } from 'app/models/store';

@Component({
  selector: 'app-check-info',
  templateUrl: './check-info.component.html',
  styleUrls: ['./check-info.component.css']
})
export class CheckInfoComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private firestoreService : FirestoreService,
    ) { }

    shop:Store;
    id:string
    successmessage:string=" is Registred With US!"
    errormessage:string=" is not Registred With US!"
    showerror=false;
  ngOnInit() 
  { 
    this.spinner.show();
    this.route.paramMap.subscribe(params => {
      this.id=params.get('id');
      this.getData(this.id);
      this.checkShopIsRegistered(this.id);
    });
   
  }
  getData(id)
  {
     this.searchService.getResultSetById(id).subscribe(async res => {
      // let id = res['id'];
      // this.router.navigate(['/detail/'+id]);
    //  console.log(res)
      if(res)
      {
        this.shop=res;
        console.log(this.shop)
        
      this.spinner.hide();
      }
      else
      {
        this.showerror=true
      }
      
     }, (err) => {
       console.log(err);
     });
    
    //  this.firestoreService.getRegisteredStores().subscribe(data => {
    //   data.map(e => {
    //     console.log("from firstore");
    //     console.log(e.payload.doc.data())
    //     //this.user=e.payload.doc.data() as Owner
    //     });
    // });
  }
  checkShopIsRegistered(id:string)
  {
    this.firestoreService.getById(id).then(data => {
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
