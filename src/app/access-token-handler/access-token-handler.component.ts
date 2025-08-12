import { Component, OnInit } from '@angular/core';
import { ErrorToast, Toast } from '../services/common.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RequestTokenBody } from '../token-history/token-history.component';

@Component({
  selector: 'app-access-token-handler',
  standalone: true,
  imports: [FormsModule, NgbTooltipModule, CommonModule],
  templateUrl: './access-token-handler.component.html',
  styleUrl: './access-token-handler.component.scss'
})
export class AccessTokenHandlerComponent implements OnInit {
  requestTokenBody: RequestTokenBody = {
    CompanyCode: "test",
    TokenName: "",
    ExpiryTimeInSeconds: 0,
    Roles: {}
  };
  
  isLoading: boolean = false;
  isReady: boolean = false;
  baseUrl: string = "";
  generatedToken: string = "";

  constructor(private http: HttpClient,
              private location: Location
  ){
    console.log(this.requestTokenBody);
  }

  ngOnInit(): void {
    this.baseUrl = environment.baseURL;
    this.isReady = true;
  }

  saveTokenDetail() {
    if (!this.requestTokenBody.TokenName) {
      ErrorToast("Please add secret key");
      return;
    }

    if (!this.requestTokenBody.ExpiryTimeInSeconds) {
      ErrorToast("Token expirary time is invalid");
      return;
    }

    this.saveContent();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      // Optionally show a toast or notification here
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  private saveContent() {
    this.isLoading = true;

    this.http.post(this.baseUrl + "accessToken/generate", this.requestTokenBody).subscribe({
      next: (res: any) => {
        Toast(res.statusCode == 200 ? "Token generate successfully" : "Fail to generate token");
        this.generatedToken = res.responseBody;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  goBack() {
    this.location.back();
  }
}