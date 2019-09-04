import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.prod";
import {map} from "rxjs/operators";


@Injectable()
export class AccountService {
    constructor(private http: HttpClient) {}

    login(data) {
        return this.http.post<any>(environment.apiOnline + 'login', data).pipe(map(data => {
            if (data)
            return data;
        })
        );
    };

}
