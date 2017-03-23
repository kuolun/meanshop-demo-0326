import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule,Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductlistComponent } from './components/productlist/productlist.component';
import { ProductdetailComponent } from './components/productdetail/productdetail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';


import 'rxjs/add/operator/map';

const appRoutes:Routes=[
  {path:'',component:ProductlistComponent},
  {path:'prodcutdetail',component:ProductdetailComponent},
  {path:'profile',component:ProfileComponent},
  {path:'cart',component:CartComponent}
];



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProductlistComponent,
    ProductdetailComponent,
    ProfileComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
