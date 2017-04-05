import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }


  sum() {
    //取出購物車資料
    let cart = this._auth.userProfile.data.cart
    let sum = 0;
    cart.forEach(item => {
      sum += item.quantity;
    });

    return sum;
  }

}
