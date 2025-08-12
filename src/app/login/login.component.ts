import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorToast, Toast } from '../services/common.service';
import { Authorization, Code, User } from '../services/constant';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isPasswordShow: boolean = false;
  type: string = "password";
  password: string = "mainAdmin";
  email: string = "info@bottomhalf.in";
  submitted: boolean = false;
  company: string ="bottomhalf";
  baseUrl: string = "";
  isLoading: boolean = false;

  constructor(private router: Router,
              private auth: AuthService,
              private http: HttpClient,
              private storage: StorageService
  ) {}
  ngOnInit(): void {
    this.baseUrl = environment.baseURL;
  }

  login() {
    this.submitted = true;
    if (this.email == null || this.email == "") {
      ErrorToast("Please enter email");
      return;
    }

    if (this.password == null || this.password == "") {
      ErrorToast("Please enter password");
      return;
    }

    let value = {
      username: this.email,
      password: this.password,
      code: this.company
    }

    this.isLoading = true;
    this.http.post(this.baseUrl + "auth/login", value).subscribe({
      next: (res: any) => {
        if (res._status_code == 200) {
          this.auth.login();
          this.storage.setAuthenticationToken(res._token);
          this.storage.setUserDetail(res._response_body.data);
          Toast("Login successfully.");
          this.isLoading = false;
          this.router.navigateByUrl("/ems/dashboad");
        } else {
          Toast("Login failed");
          this.isLoading = false;
        }
      }, error: err => {
        this.isLoading = false;
        ErrorToast(err._response_body);
      }
    })
  }

  showHidePassword() {
    this.isPasswordShow = !this.isPasswordShow;
    if (this.isPasswordShow)
      this.type = "text";
    else
      this.type = "password";
  }
}