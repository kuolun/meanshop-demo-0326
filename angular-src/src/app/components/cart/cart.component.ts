import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  user;

  takePaymentResult: string;

  constructor(private _auth: AuthService, private _http: Http) {
  }

  ngOnInit() {
    //利用service的user profile去DB載入完整的product資料
    this._auth.loadUser(this._auth.userProfile)
      .subscribe(data => {
        this.user = this._auth.userProfile = data.loadedUser;
      })
  }


  removeProduct(productIndex) {
    console.log(this.user);

    //更新service的總金額
    this.user.data.totalValue -= this.user.data.cart[productIndex].subtotal;

    //移除點選的product
    this.user.data.cart.splice(productIndex, 1);

    //update DB
    let updatedItem = {
      cart: this.user.data.cart,
      totalValue: this.user.data.totalValue
    }

    this._http.put('http://localhost:3000/remove', {
      updatedItem: updatedItem,
      email: this.user.email
    }).
      subscribe(user => console.info('updatedItem:', user));


  }


  // 點pay button觸發，從stripe取回token
  openCheckout() {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_gYmq7G71sVayHcy4J8SjZHKA',
      locale: 'auto',
      token: token => this.takePayment(token)
    }
    );

    console.log(this.user.data.totalValue);

    handler.open({
      name: 'Shop Smart Site',
      description: 'Pay with Stripe',
      amount: this.user.data.totalValue * 100,// cent
      allowRememberMe: false
    });
  }


  // 送token跟結帳金額給後端
  takePayment(token: any) {
    let body = {
      tokenId: token.id,
      amount: this.user.data.totalValue,
      userEmail: token.email,
      user: this.user
    }

    //把body轉成String
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this._http.post('http://localhost:3000/stripepayment', bodyString, options)
      .subscribe(
      res => {
        console.log('data:', res.json().status)
        // 清空Service的cart資料
        this.user.data.cart = []
        this.user.data.totalValue = 0


        //送出成功訊息
        this.takePaymentResult = `Your payment process is completeted!! chargeId is ${res.json().id}`;
      },
      error => console.log(error.message),
      () => console.log('Authentication Complete')
      )
  }

}
