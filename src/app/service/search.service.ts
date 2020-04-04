import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Result, Enheter } from '../models/result';
import { Urls } from '../models/urls';
import { Store } from '../models/store';

const apiurl=Urls.apiurl;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseurl="https://data.brreg.no/enhetsregisteret/api/enheter";
  private url_call:string
  constructor(private  httpclient:HttpClient) { }

  getResultSet(key:String )
  {
    this.url_call=this.baseurl+"?navn="+key;
    console.log(this.url_call)
   return  this.httpclient.get<Result>(this.url_call);
  }
  getResultSetById(id:string)
  {
    
    this.url_call=this.baseurl+"/"+id;
    console.log(this.url_call)
   return  this.httpclient.get<Store>(this.url_call);
  }
}
