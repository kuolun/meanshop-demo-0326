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


  countItem() {
    let itemCount = 0;
    //加總購物車item數
    this._auth.userProfile.data.cart
      .forEach(item => {
        itemCount += item.quantity;
      });
    return itemCount;
  }

}
