import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt'
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  //使用者資訊
  userProfile;


  // 設定Auth0
  lock = new Auth0Lock('WYZtNTzNCFi6UxHwStr8F1HgngOMnI5t', 'kuolun.auth0.com', {});


  constructor(private _http: Http, private _router: Router) {
    // Add callback for lock `authenticated` event
    // authResults內會有JWT
    this.lock.on("authenticated", (authResult) => {

      //authenticated包含登入及sign up成功
      //Auth0驗證過後，用accessToken取得user profile
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }

        //檢查是否為登入
        this.checkDBUser(profile)
          .subscribe(data => {
            if (!data.user) {
              //如果db不存在此user
              //將Auth0提供的user profile存到DB
              this.createUser(profile)
                .subscribe(
                data => {
                  localStorage.setItem('id_token', authResult.idToken);
                  //db回傳的存到localStorage
                  localStorage.setItem('profile', JSON.stringify(data.savedUser));
                  this.userProfile = data.savedUser;
                },
                err => this.logout());
            } else {
              console.log('User already in DB,load user data');
              this.loadUser(profile)
                .subscribe(data => {
                  console.log('LoadedUser:', data.loadedUser);
                  // 把載入的user存到localStorage
                  localStorage.setItem('id_token', authResult.idToken);
                  localStorage.setItem('profile', JSON.stringify(data.loadedUser));
                  this.userProfile = data.loadedUser;
                });
            }
          });
      });
    });
  }




  /**
   * Create a user
   */

  createUser(profile) {
    console.log("createing user...");
    // 加上header info
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let bodyString = JSON.stringify(profile);

    //body要轉成string,headers要用物件
    return this._http.post('http://localhost:3000/newUser', bodyString, options)
      .map(res => res.json());
  }

  /**
   * Check User是否存在DB
   */
  checkDBUser(profile) {
    return this._http.get(`http://localhost:3000/checkDBUser/${profile.email}`)
      .map(res => res.json());
  }


  /**
   * 載入DB User資料
   * 把productId換成實際product資料
   */
  loadUser(profile) {
    return this._http.get(`http://localhost:3000/user/${profile.email}`)
      .map(res => res.json());
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    this.userProfile = null;
    this._router.navigate(['/']);
  }
}
