import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Authorization, Auth, Code, CurrentRepoId, CurrentRepoName } from './constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  constructor(private router: Router){}
  login() {
    this.isLoggedIn = true;
    sessionStorage.setItem(Auth, 'true'); // Optional: persist login
  }

  logout(): void {
    this.isLoggedIn = false;
    //sessionStorage.removeItem(this.auth);
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || sessionStorage.getItem(Auth) === 'true';
  }

  getCurrentCompany(): string {
    return sessionStorage.getItem(Code);
  }

  getAccessToken(): string {
    return sessionStorage.getItem(Authorization);
  }

  getRepoId(): number {
    var repoId =  sessionStorage.getItem(CurrentRepoId);
    return Number(repoId);
  }

  setRepoId(repoId: number) {
    return sessionStorage.setItem(CurrentRepoId, repoId.toString());
  }

  getRepoName(): string {
    return  sessionStorage.getItem(CurrentRepoName);
  }

  setRepoName(repoName: string) {
    return sessionStorage.setItem(CurrentRepoName, repoName);
  }
}
