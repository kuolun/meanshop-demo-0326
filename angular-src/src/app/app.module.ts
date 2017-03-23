import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './src/app/components/navbar/navbar.component';
import { ProductlistComponent } from './src/app/components/productlist/productlist.component';
import { ProductdetailComponent } from './src/app/components/productdetail/productdetail.component';
import { ProfileComponent } from './src/app/components/profile/profile.component';
import { CartComponent } from './src/app/components/cart/cart.component';

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
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
