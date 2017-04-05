import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt'
import { Http, Headers } from '@angular/http';
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

      //Auth0驗證過後，用accessToken取得user profile
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }

        //檢查user是否已經存在於DB
        //否=>建立user
        //是=>載入user

        // 呼叫checkDBUser()檢查
        if (!this.checkDBUser(profile)) {
          // 不存在DB，建立一筆
          this.createUser(profile)
            .subscribe(
            data => {
              localStorage.setItem('id_token', authResult.idToken);
              localStorage.setItem('profile', JSON.stringify(data.savedUser));
              this.userProfile = data.savedUser;
            },
            err => {
              this.logout();
            });
        } else {
          //已存在DB內，用loadUser載入資料
          this.loadUser(profile)
            .subscribe(data => {
              localStorage.setItem('id_token', authResult.idToken);
              localStorage.setItem('profile', JSON.stringify(data.loadedUser));
              this.userProfile = data.loadedUser;
            })
        }
      });
    });
  }


  /**
   * Check User是否存在DB
   */
  checkDBUser(profile) {
    return this._http.get(`http://localhost:3000/checkDBUser/${profile.email}`)
      .map(res => res.json())
      .subscribe(data => data.user ? true : false);
  }

  /**
   * Create a user
   */

  createUser(profile) {
    // 加上header info
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    //body要轉成string,headers要用物件
    return this._http.post('http://localhost:3000/newUser',
      profile, { headers: headers })
      .map(res => res.json());
  }


  /**
   * 載入DB User資料
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
