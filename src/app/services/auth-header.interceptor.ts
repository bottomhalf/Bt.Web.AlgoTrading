import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private loader: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var code = "BATRIC";
    if (req.url.includes("login")) {
      const modifiedReq = req.clone({
        setHeaders: {
          Code: code, // Bottomhalf Algorithimc Trading TRIcks
        }
      });
      return next.handle(modifiedReq);
    } else {
      const token = this.authService.getAccessToken(); 
      if(token == null || token == "") {
        throw "Token not found. Please login again.";
      }
      this.loader.showLoader();
      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: "Bearer " + token, // You can replace with dynamic values
          Code: code,
        }
      });
      return next.handle(modifiedReq).pipe(
        finalize(() => {
          this.loader.hideLoader();
        })
      );
    }
  }
}
