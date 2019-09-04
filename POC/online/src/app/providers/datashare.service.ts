import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DataShareService {
    onBoardingTabHeader: any;
    @Output() change: EventEmitter<string> = new EventEmitter();

    private messageShare = new BehaviorSubject<any>([]);
    currentMessage = this.messageShare.asObservable();
    private dataToBeShare = new BehaviorSubject<any>([]);
    currentData = this.dataToBeShare.asObservable();

    private showHeader = new BehaviorSubject<any>([]);
    currentHeader = this.showHeader.asObservable();

    private showLoader = new BehaviorSubject<any>([]);
    currentLoader = this.showLoader.asObservable();
    private Language  = new BehaviorSubject<any>([]);
    currentLanguage = this.Language.asObservable();

    private captchaLoad  = new BehaviorSubject<any>([]);
    CaptchaLoaded = this.captchaLoad.asObservable();

    private captchaResponse  = new BehaviorSubject<any>([]);
    CaptchaResponse = this.captchaResponse.asObservable();

    toggle(key: any) {
        this.onBoardingTabHeader = key;
        this.change.emit(this.onBoardingTabHeader);
    }

    updateData(data: any,keyToShare) {
        switch(keyToShare){
            case 'Msg':
                this.messageShare.next(data);
                break;
            case 'Data':
                this.dataToBeShare.next(data);
                break;
            case 'Loader':
                this.showLoader.next(data);
                break;
            case 'Language':
                this.Language.next(data);
            case 'captchaLoaded':
                this.captchaLoad.next(data);
            case 'captchaValidated':
                this.captchaResponse.next(data);
        };
    };

    updateHeader(data: any) {
        this.showHeader.next(data)
    };
}

