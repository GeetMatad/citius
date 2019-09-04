import {Inject, Injectable} from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse,
    HttpResponse
} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {DataShareService} from "./datashare.service";

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
    domain: string;
    url: string;
    token: string;
    interceptorError: any;
    constructor(private route: ActivatedRoute, @Inject(DOCUMENT)
                private document: any,
                private router :Router,
                private dataShare: DataShareService) {
    }

    addHeader(req: HttpRequest<any>): HttpRequest<any> {
        const token = !!localStorage.getItem('token') ? localStorage.getItem('token') : '';
        if (req.url.endsWith('/online/login') && req.method === 'POST') {
            return req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        } else {
            return req.clone({
                    headers: req.headers.set('Content-Type', 'application/json')
                        .set('Authorization', token)
                });
        }
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(this.addHeader(req)).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (!!event.body.status && event.body.status != 200) {
                  this.interceptorError = {
                    display: true,
                    message: event.body.message
                  };
                  this.dataShare.updateData(this.interceptorError,'Msg');

                  setTimeout(() => {
                    this.interceptorError = {
                      display: false,
                      message: ''
                    };
                    this.dataShare.updateData(this.interceptorError,'Msg');
                  }, 5000);
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                this.HandleErrorMsg(err);
            }
        })
        );
    }
    HandleErrorMsg = (err)=>{
        switch (err.status){
            case 401:
                this.reDirectFunction(401);
                break;
            case 403:
                this.reDirectFunction(403);
                break;
            case 404:
                this.reDirectFunction(404);
                break;
            default: {
                this.reDirectFunction();
                break;
            }
        }
    }

    reDirectFunction(errorCode?){
      const defaultErrorMsg = {
        display: true,
        message: 'Something went wrong'
      };
      const removeErrorMsg ={
        display: false,
        message:  ''
      };
      localStorage.clear();
        localStorage.clear();
        if([401,403].indexOf(errorCode)>-1) {
          this.dataShare.updateData(defaultErrorMsg ,'Msg');
          setTimeout(() => {
            this.dataShare.updateData(false,'Loader');
            this.dataShare.updateData(removeErrorMsg,'Msg');
          }, 5000);
            this.router.navigate(['/login']);
        } else if(errorCode == 404){
            this.router.navigate(['/404']);
        }else{
            this.router.navigate(['/home']);
        }

    }
}
