import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ErrorToast, HideModal, ShowModal, Toast } from '../services/common.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AllownumberDirective } from '../services/allownumber.directive';

@Component({
  selector: 'app-token-history',
  standalone: true,
  imports: [FormsModule, NgbTooltipModule, CommonModule, NgbTooltipModule, AllownumberDirective],
  templateUrl: './token-history.component.html',
  styleUrl: './token-history.component.scss',
})
export class TokenHistoryComponent implements OnInit {
  baseUrl: string = "";
  isLoading: boolean = false;
  isReady: boolean = false;
  requestTokenBody: RequestTokenBody = {
    CompanyCode: "test",
    TokenName: "",
    ExpiryTimeInSeconds: null,
    Roles: {}
  };
  tokenHistory: Array<TokenHistory> = [];
  submitted: boolean = false;
  selectedToken: TokenHistory = null;
  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.baseUrl = environment.baseURL;
    this.isLoading = false;
    this.isReady = false;

    this.loadTokenHistory();
  }

  generateNewToken() {
    this.requestTokenBody = {
      CompanyCode: "test",
      TokenName: "",
      ExpiryTimeInSeconds: null,
      Roles: {}
    };
    this.submitted = false;
    ShowModal("addTokenModal");
  }

  copyToClipboard(text: string, tooltip: any): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      tooltip.open();
      setTimeout(() => tooltip.close(), 1500); // Close tooltip after 1.5s
      // Optionally show a toast or notification here
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  loadTokenHistory() {
    this.isLoading = true;
    this.isReady = false;
    this.tokenHistory = [];
    this.http
      .get(`${this.baseUrl}accessToken/getTokens/1`)
      .subscribe({
        next: (res: any) => {
          Toast(
            res.statusCode == 200
              ? 'Token generate successfully'
              : 'Fail to generate token'
          );

          this.tokenHistory = res.responseBody as Array<TokenHistory>;
          this.isLoading = false;
          this.isReady = true;
        },
        error: (error) => {
          this.isLoading = false;
          ErrorToast(error.error.ResponseBody);
        },
      });
  }

  getTokenExpiration(token: string): Date | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

      if (decodedPayload.exp) {
        return new Date(decodedPayload.exp * 1000);
      }

      return null;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;

      if (!expiry) return true;

      const now = Math.floor(Date.now() / 1000); // current time in seconds

      return now >= expiry;
    } catch (error) {
      console.error('Invalid token', error);
      return true;
    }
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

   private saveContent() {
    this.isLoading = true;

    this.http.post(this.baseUrl + "accessToken/generate", this.requestTokenBody).subscribe({
      next: (res: any) => {
        this.tokenHistory = [];
        Toast(res.statusCode == 200 ? "Token generate successfully" : "Fail to generate token");
        this.tokenHistory = res.responseBody as Array<TokenHistory>;
        this.isLoading = false;
        HideModal("addTokenModal");
      },
      error: error => {
        this.isLoading = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  regenerateTokenPop(item: any) {
    this.selectedToken = item;
    ShowModal("regenerateTokenModal");
  }

  regenerateToken() {
    if (this.selectedToken) {
      this.isLoading = true;

      this.http.get(this.baseUrl + `accessToken/reGenerateToken/${this.selectedToken.TokenHandlerId}`).subscribe({
        next: (res: any) => {
          this.tokenHistory = [];
          Toast(res.statusCode == 200 ? "Token re-generate successfully" : "Fail to re-generate token");
          this.tokenHistory = res.responseBody as Array<TokenHistory>;
          this.isLoading = false;
          HideModal("regenerateTokenModal");
        },
        error: error => {
          this.isLoading = false;
          ErrorToast(error.error.ResponseBody);
        }
      })
    }
  }

  deleteTokenPop(item: any) {
    this.selectedToken = item;
    ShowModal("deleteTokenModal");
  }

  deleteToken() {
    if (this.selectedToken) {
      this.isLoading = true;

      this.http.delete(this.baseUrl + `accessToken/deleteToken/${this.selectedToken.TokenHandlerId}`).subscribe({
        next: (res: any) => {
          this.tokenHistory = [];
          Toast(res.statusCode == 200 ? "Token deleted successfully" : "Fail to delete token");
          this.tokenHistory = res.responseBody as Array<TokenHistory>;
          this.isLoading = false;
          HideModal("deleteTokenModal");
        },
        error: error => {
          this.isLoading = false;
          ErrorToast(error.error.ResponseBody);
        }
      })
    }
  }
}

export interface TokenHistory {
  TokenName: string;
  RandomStateValue: number;
  UserIdOrEmail: string;
  GeneratedOn: number;
  UpdatedOn: number;
  GeneratedToken: string;
  UserId: number;
  TokenHandlerId: number
}

export interface RequestTokenBody {
  CompanyCode: string,
  TokenName: string,
  ExpiryTimeInSeconds: number,
  Roles: any
}