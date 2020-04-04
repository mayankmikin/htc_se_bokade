import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from 'app/service/search.service';
import { Messages } from 'app/models/urls';
import { ButtonViewComponent } from 'app/button.component';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map,switchMap, catchError} from 'rxjs/operators';
import { UpperCasePipe } from '@angular/common';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [UpperCasePipe]
})
export class SearchComponent implements OnInit {
  successMessage:string;
  errorMessage:string;
  title = 'Search Store / Shop';
  searchText;
  constructor(private spinner: NgxSpinnerService,
    private searchService: SearchService,
    ) { }
    onKey(value: string) {
      this.getData(value)
    }
    search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( (searchText) =>  this.searchService.getResultSet(searchText) ), 
      // map(term => term.length < 2 ? []
      //   : this.data.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  settings = {
    pager: {
      display: true,
      perPage:10,
    },
    actions: {
      columnTitle: 'Action',
      add: false,
      edit: false,
      delete: false,
      position: 'left'
    },
    //actions: [],
    columns: {
      organisasjonsnummer: {
        title: 'Organisation Number'
      },
      navn: {
        title: 'Name'
      },
      // organisasjonsform: {
      //   title: 'organisasjonsform'
      // },
      // beskrivelse: {
      //   title: 'beskrivelse'
      // },
      Buttons: {
        title: 'Actions',
        filter: false,
        type: 'custom',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => row);
        }
      },
    },
    attr: {
      class: 'table table-striped table-bordered table-hover'
    },
    defaultStyle: false
  };
  data=[]
  ngOnInit() {
    this.spinner.show();
    this.getData("");
  }

  getData(key)
  {
     this.searchService.getResultSet(key).subscribe(res => {
      // let id = res['id'];
      // this.router.navigate(['/detail/'+id]);
      console.log(res)
      if(res._embedded)
      {
        this.data=res._embedded.enheter;
        this.settings.pager.perPage=res.page.size;
        
     
      this.spinner.hide();
      this.successMessage=Messages.SAVED;
      }
      
     }, (err) => {
       console.log(err);
       this.showBackendError(err);
     });
  }
  public showBackendError(error)
  {
    this.spinner.hide();
    this.errorMessage= error;
    this.spinner.hide();
  }

}
