import { Component, OnInit , Inject } from '@angular/core';
import { SearchService } from 'app/service/search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Enheter } from 'app/models/result';
import { FirestoreService } from 'app/services/firestore.service';
import { Store, Calendar, Slot, TMonth, Time, Close } from 'app/models/store';


@Component({
  selector: 'app-registershop',
  templateUrl: './registershop.component.html',
  styleUrls: ['./registershop.component.css']
})
export class RegistershopComponent implements OnInit {


  constructor(private spinner: NgxSpinnerService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private firestoreService : FirestoreService,
    private router:Router,
    ) { }
    organisasjonsnummer:string;
    shop:Store=new Store();
    fshop:Store=new Store();
    id:string
    durationInSeconds = 5;
    maxcount: number=5;
    onSubmit(openpicker,closepicker) {
      console.log(openpicker)
      console.log(closepicker)
      
        if(this.id!=this.shop.organisasjonsnummer)
        {
          alert('ERROR No organisation number found: '+this.shop.organisasjonsnummer )
        }
        else
        {
          console.log(this.shop)
          //console.log(closepicker)
          var time=new Time()
          time.open= new Close();
          time.close= new Close();
          var t=openpicker.defaultTime.split(" ")
          var hrs=t[0].split(":")
          time.open.period=t[1]
          time.open.hour=+hrs[0]
          time.open.minute=+hrs[1]
          var t=closepicker.defaultTime.split(" ")
          var hrs=t[0].split(":")
          time.close.period=t[1]
          time.close.hour=+hrs[0]
          time.close.minute=+hrs[1]
       
          console.log(time)
          this.save(time);
        }
    }

  ngOnInit() 
  { 
    this.spinner.show();
    this.route.paramMap.subscribe(params => {
      this.id=params.get('id');
      this.getData(this.id);
    });
  }

   getData(id)
  {
     this.searchService.getResultSetById(id).subscribe(res => {
      // let id = res['id'];
      // this.router.navigate(['/detail/'+id]);
    //  console.log(res)
      if(res)
      {
        this.shop=res;
        console.log(this.shop)
        this.spinner.hide();
      }
      
     }, (err) => {
       console.log(err);
     });
    
     this.firestoreService.getRegisteredStores().subscribe(data => {
      data.map(e => {
        console.log("from firstore");
        console.log(e.payload.doc.data())
        this.fshop=e.payload.doc.data() as Store
        });
    });

  }
  
  save(time:Time)
  {
    var plusOne=0; // add more people
    var s= new Slot();
    s.slot=2
    s.bookingcount=1+plusOne;
    var c= new Calendar();
    var cmonth=new TMonth();
    cmonth.day=1
    cmonth.slots.push(s);
    cmonth.slots=cmonth.slots.map((obj)=> {return Object.assign({}, obj)});
    c.currentMonth.push(cmonth);
    c.currentMonth=c.currentMonth.map((obj)=> {return Object.assign({}, obj)});
    this.shop.maxpeopleallowed=10;
    this.shop.maxtimeallowed=10;
    this.shop.currentpeoplecount=3;
    this.shop.calendar=[];
    this.shop.calendar.push(c)
    const custom = this.shop.calendar.map((obj)=> {return Object.assign({}, obj)});
    this.shop.calendar=custom
    // to avoid custom object save error for firbase 
    time.close=Object.assign({}, time.close);
    time.open=Object.assign({}, time.open);
    this.shop.time=Object.assign({}, time);
    this.shop.maxpeopleallowed=this.maxcount;
    this.firestoreService.saveStore(this.shop);
    alert(this.organisasjonsnummer+'registered successfully ')
    this.router.navigate(['/check', this.organisasjonsnummer]);
  }
}


