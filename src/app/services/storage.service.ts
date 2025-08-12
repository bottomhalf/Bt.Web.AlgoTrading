import { Injectable } from '@angular/core';
import { Authorization, User } from './constant';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  setAuthenticationToken(token: any) {
    sessionStorage.setItem(Authorization, token);
  }

  getAuthenticationToken() {
    return sessionStorage.getItem(Authorization);
  }

  setUserDetail(user: any) {
    sessionStorage.setItem(User, JSON.stringify(user));
  }

  getUserDetail(): UserDetail {
    let userDetail = JSON.parse(sessionStorage.getItem(User));
    let user: UserDetail = { };
    if(userDetail) {
      user = {
        clientcode: userDetail['clientcode'],
        name: userDetail['name'],
        email: userDetail['email'],
        mobileno: userDetail['mobileno'],
        lastlogintime: userDetail['lastlogintime']
      }
    }
    
    return user;
  }
}

export interface UserDetail {
    clientcode?: string,
    name?: string,
    email?: string,
    mobileno?: string,
    exchanges?: Array<any>,
    products?: Array<any>,
    lastlogintime?: string,
    broker?: string
}
