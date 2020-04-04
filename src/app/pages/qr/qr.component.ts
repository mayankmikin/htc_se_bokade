import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  qrcodename : string;
  title = 'generate-qrcode';
  elementType: 'url' | 'canvas' | 'img' = 'url';
  value: string;
  display = false;
  href : string;
  generateQRCode(){
    if(this.qrcodename == ''){
      this.display = false;
      alert("Please enter the details");
      return;
    }
    else{
      this.value = this.qrcodename;
      this.display = true;
    }
  }
  downloadImage(){
    this.href = document.getElementsByTagName('img')[0].src;
  }
}
