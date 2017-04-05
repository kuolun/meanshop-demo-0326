import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //購物車內item數
  itemCount = 0;

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    console.log('userProfile:', this._auth.userProfile);
  }


  countItem() {
    // if (this._auth.userProfile.data.cart.length > 0) {
    //   //加總購物車item數
    //   this._auth.userProfile.data.cart.forEach(item => {
    //     this.itemCount += item.quantity;
    //   });
    // }
    return this.itemCount;
  }

}
