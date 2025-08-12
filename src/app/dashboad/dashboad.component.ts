import { Component, OnInit } from '@angular/core';
import { ErrorToast, HideModal, ShowModal, Toast } from '../services/common.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService, UserDetail } from '../services/storage.service';

@Component({
  selector: 'app-dashboad',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboad.component.html',
  styleUrl: './dashboad.component.scss'
})
export class DashboadComponent implements OnInit {
  isLoading: boolean = false;
  submitted: boolean = false;
  tickerDetails: Array<TickerDetail> = [];
  isPageReady: boolean = false;
  isDataLoaded: boolean = false;
  isStockDetailLoaded: boolean = false;
  isTickerAvailable: boolean = false;
  private baseUrl: string = "";
  user: UserDetail = { };
  stockDetail: any = null;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private storage: StorageService
  ) {}
  
  ngOnInit(): void {
    this.baseUrl = environment.baseURL;
    this.user = this.storage.getUserDetail();
    this.loadTickers('');
    this.isDataLoaded = true;
  }

  loadTickers(symbol: string) {
    this.isPageReady = false;
    let userId = 1;
    this.http.get(this.baseUrl + `tickers/get/${symbol}`).subscribe({
      next: (res: any) => {
        if (res._response_body) {
          const body = res._response_body || [];
          this.tickerDetails = [];
          body.map((item: any) => (
              this.tickerDetails.push({
                token: item.token,
                symbol: item.symbol,
                name: item.name,
                expiry: item.expiry,
                strike: item.strike,
                lotsize: item.lotsize,
                instrumenttype: item.instrumenttype,
                exch_seg: item.exch_seg,
                tick_size: item.tick_size
              })
          )) as TickerDetail[];

          this.isTickerAvailable = true;
        }
      },
      error: error => {
        this.isTickerAvailable = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  getTickers(e: any) {
    this.loadTickers(e.currentTarget.value);
  }

  getMarketData(item: any) {
    this.isStockDetailLoaded = false;
    this.http.post(this.baseUrl + "historical/getmarketdata", item).subscribe({
      next: (res: any) => {
        if (res._response_body) {
          if(res._response_body['data'] && 
            res._response_body['data']['fetched'] && res._response_body['data']['fetched'].length > 0) {
              this.stockDetail = res._response_body['data']['fetched'][0]
          }

          this.isStockDetailLoaded = true;
        }
      },
      error: error => {
        this.isStockDetailLoaded = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  currencyItems = [
    { name: 'USDINR AUG FUT', diff: '-0.1575', change: '-0.18', value: '87.5975' },
    { name: 'JPYINR AUG FUT', diff: '-0.5000', change: '-0.85', value: '58.5000' },
    { name: 'USDINR SEP FUT', diff: '0.1475', change: '0.17', value: '87.6950' }
  ];

  tableData = [
    { date: '01/08 16:00', open: 87.5829, high: 87.6475, low: 87.5825, close: 87.6188 },
    { date: '01/08 15:00', open: 87.5346, high: 87.6650, low: 87.5346, close: 87.6294 },
    { date: '01/08 14:00', open: 87.5400, high: 87.6100, low: 87.5367, close: 87.5677 },
    { date: '01/08 13:00', open: 87.4829, high: 87.5700, low: 87.4829, close: 87.5050 },
    { date: '01/08 12:00', open: 87.4683, high: 87.5700, low: 87.4573, close: 87.5175 },
    { date: '01/08 11:00', open: 87.5179, high: 87.5197, low: 87.4867, close: 87.4867 },
    { date: '31/07 16:00', open: 87.6309, high: 87.6930, low: 87.3225, close: 87.3690 },
    { date: '31/07 15:00', open: 87.7016, high: 87.7820, low: 87.6360, close: 87.9690 }
    // ...etc
  ];

}

export interface TickerDetail {
  token: string;
  symbol: string;
  name: string;
  expiry: string;
  strike: string;
  lotsize: string;
  instrumenttype: string;
  exch_seg: string;
  tick_size: string;
}