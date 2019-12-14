import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { Ayat } from './page/ayat/ayat.model';

declare let FontFace: any;

export class StartupState { isOpenPerAyat: boolean; lastPageOpened: number; firstWordFocus: number; currentWordFocus: number; }

@Injectable({ providedIn: 'root' })
export class DataService {

    private listPage: Ayat[][] = [];
    private loadedFont = [];

    isOpenPerAyat: boolean = false;
    leftPageChanged = new BehaviorSubject<number>(0);
    rightPageChanged = new BehaviorSubject<number>(0);
    leftPageLoading = new BehaviorSubject<boolean>(true);
    rightPageLoading = new BehaviorSubject<boolean>(true);

    leftPageError = new BehaviorSubject<boolean>(false);
    rightPageError = new BehaviorSubject<boolean>(false);

    private firstWordFocus = 0;
    private currentWordId = 0;
    wordFocusSubject = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

    getPageContent(page: number): Ayat[] {
        if (page == 0) return [];

        let cur = 1;
        if (page % 2 == 0) cur += 1000;
        return this.listPage[page].map(listAyat => {
            listAyat.words.forEach(word => {
                word.isHidden = this.isOpenPerAyat
                word.id = cur;
                cur++;
            });
            return listAyat;
        });
    }

    private currentStartupState: StartupState = null

    setStartupState(isOpenPerAyat?: boolean, lastPageOpened?: number, firstWordFocus?: number, currentWordFocus?: number) {
        if (this.currentStartupState != null) {
            if (isOpenPerAyat) this.currentStartupState.isOpenPerAyat = isOpenPerAyat;
            if (lastPageOpened) this.currentStartupState.lastPageOpened = lastPageOpened;
            if (firstWordFocus) this.currentStartupState.firstWordFocus = firstWordFocus;
            if (currentWordFocus) this.currentStartupState.currentWordFocus = currentWordFocus;
        } else {
            this.currentStartupState = {
                isOpenPerAyat,
                lastPageOpened,
                firstWordFocus,
                currentWordFocus
            }
        }
        this.storage.set('startupState', this.currentStartupState);
    }

    getStartupState(): StartupState {
        const startupState: StartupState = this.storage.get('startupState');
        if (startupState != null) {
            this.currentStartupState = startupState;

            this.isOpenPerAyat = startupState.isOpenPerAyat;
            this.firstWordFocus = startupState.firstWordFocus;
            this.currentWordId = startupState.currentWordFocus;

            this.wordFocusSubject.next(this.currentWordId);
        }

        return startupState;
    }

    setFistWordFocus(id: number) {
        this.firstWordFocus = id;
        this.setStartupState(undefined, undefined, id, id);
        this.restartWordFocus();
    }

    focusNextWord() {
        this.currentWordId++;
        this.wordFocusSubject.next(this.currentWordId);
    }

    restartWordFocus() {
        this.currentWordId = this.firstWordFocus;
        this.wordFocusSubject.next(this.currentWordId);
    }

    loadPage(page: number) {
        this.loadFont(page);

        this.showLoading(page);

        if (this.listPage[page]) {
            this.publishPageContent(page);
            this.hideLoading(page);
            this.hideError(page);
        } else {
            this.http.get<Ayat[]>(`https://reza-id.herokuapp.com/ayat/${page}`)
                .subscribe(data => {
                    let listAyat = [];
                    let currentLine = 1;
                    for (let i = 0; i < data.length; i++) {
                        const ayat = data[i];
                        const trans = ayat.translations[0];
                        for (let j = 0; j < ayat.words.length; j++) {
                            if (currentLine != ayat.words[j].line_number) {
                                // give <br> tag
                                if (ayat.verse_number != 1 || ayat.words[j].position != 1) {
                                    ayat.words[j].isNewLine = true;
                                }
                                currentLine = ayat.words[j].line_number;
                            }

                            if (j == (ayat.words.length - 1)) {
                                ayat.words[j].translation = [{
                                    id: trans.id,
                                    language_name: trans.language_name,
                                    text: trans.text,
                                    resource_id: trans.resource_id
                                }];
                                ayat.words[j].isAyatNumber = true;
                            }
                        }
                        listAyat.push(ayat);
                    }

                    if (data.length > 0) {
                        this.listPage[data[0].page_number] = listAyat;
                        this.publishPageContent(data[0].page_number);
                        this.hideLoading(data[0].page_number);
                        this.hideError(data[0].page_number);
                    }

                }, error => {
                    if (error['url']) {
                        const pageError = error['url'].match(/\d+/g);
                        if (pageError) {
                            this.showError(pageError);
                            this.hideLoading(pageError);
                        }
                    }
                });
        }
    }

    private publishPageContent(page: number) {
        if (page % 2 != 0) {
            this.rightPageChanged.next(page);
        } else {
            this.leftPageChanged.next(page);
        }
    }

    private showLoading(page: number) {
        if (page % 2 != 0) {
            this.rightPageLoading.next(true);
        } else {
            this.leftPageLoading.next(true);
        }
    }

    private hideLoading(page: number) {
        if (page % 2 != 0) {
            this.rightPageLoading.next(false);
        } else {
            this.leftPageLoading.next(false);
        }
    }

    private showError(page: number) {
        if (page % 2 != 0) {
            this.rightPageError.next(true);
        } else {
            this.leftPageError.next(true);
        }
    }

    private hideError(page: number) {
        if (page % 2 != 0) {
            this.rightPageError.next(false);
        } else {
            this.leftPageError.next(false);
        }
    }

    private loadFont(page: number) {
        const pageNumber = `page${page}`;
        let customFont = new FontFace(pageNumber, `url(https://quran-1f14.kxcdn.com/fonts/ttf/p${page}.ttf)`);
        if (!this.loadedFont.includes(pageNumber)) {
            customFont.load().then((res) => {
                document['fonts'].add(res);
                this.loadedFont.push(pageNumber);
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}