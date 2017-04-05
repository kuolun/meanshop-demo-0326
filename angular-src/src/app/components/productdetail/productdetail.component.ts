import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product;

  quantity = 1;


  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router,
    private _auth: AuthService
  ) { }

  ngOnInit() {
    //用URL上id取得product data
    const url = 'http://localhost:3000/product';
    const id = this._route.snapshot.params['id'];
    this._http.get(`${url}/${id}`)
      .map((res) => res.json().product)
      .subscribe(product => {
        this.product = product;
      });
  }

  // 購買數量
  changeQty(num) {
    this.quantity += num;
    if (this.quantity < 1)
      this.quantity = 1;
  }


  //小計
  subtotal(): number {
    return this.quantity * this.product.price
  }


  // 回首頁
  onBack() {
    this._router.navigate(['/']);
  }



  addToCart() {
    //購物車資料
    let cartData = this._auth.userProfile.data;

    //購買產品的資料
    var item = {
      product: this.product._id,
      quantity: this.quantity,
      subtotal: this.subtotal()
    };

    //增加cart array的item
    cartData.cart.push(item);

    //增加cartData的總金額
    cartData.totalValue += this.subtotal();

    //更新DB(async)
    //傳入的資料為item，會放在req.body內
    this._http.put('http://localhost:3000/updateCart', {
      newCart: cartData.cart,
      newTotal: cartData.totalValue,
      email: this._auth.userProfile.email
    }).
      subscribe(user => console.log(user));
  }

}
