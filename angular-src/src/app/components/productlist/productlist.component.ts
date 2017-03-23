import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  products;
  categories;

  constructor(private _http:Http) { }

  //取得產品目錄
  getCategory() {
    let urls = 'http://localhost:3000/categories/all'
    return this._http.get(urls)
        .map(res => res.json().categories);
  }

  //取得所有產品
  getProducts(filter?) {
    let url = 'http://localhost:3000/productsall';

    //如果有filter，就把url換掉
    if (filter && filter.id) {
      url = 'http://localhost:3000/products/'+filter.id;
    }

    // products是obs，所以template那邊要用async
    return this._http.get(url)
      .map(res => res.json().products);
  }

  //切換目錄時會呼叫
  reloadProducts(filter) {
    this.getProducts(filter).subscribe(products=>this.products=products);
  }

  ngOnInit() {
    this.getProducts().subscribe(products=>this.products=products);
    this.getCategory().subscribe(categories=>this.categories=categories);
  }

}
