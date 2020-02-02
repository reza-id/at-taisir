import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, VirtualTimeScheduler } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { Ayat } from './page/ayat/ayat.model';

declare let FontFace: any;

export class StartupState { isItemHidden: boolean; lastPageOpened: number; firstItemFocus: number; currentItemFocus: number; openMode: string; }

@Injectable({ providedIn: 'root' })
export class DataService {

    private listPage: Ayat[][] = [];
    private loadedFont = [];

    isItemHidden: boolean = false;
    openMode: String = 'word';
    leftPageChanged = new BehaviorSubject<number>(0);
    rightPageChanged = new BehaviorSubject<number>(0);
    leftPageLoading = new BehaviorSubject<boolean>(true);
    rightPageLoading = new BehaviorSubject<boolean>(true);

    leftPageError = new BehaviorSubject<boolean>(false);
    rightPageError = new BehaviorSubject<boolean>(false);

    private firstItemFocus = 0;
    private currentFocusItemIndex = 0;
    private maxWordIndex = 0;
    private maxAyatIndex = 0;
    itemFocusSubject = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient, @Inject(LOCAL_STORAGE) private storage: StorageService) { }

    getPageContent(page: number): Ayat[] {
        if (page == 0) return [];

        const isLeftPage = page % 2 == 0;
        return this.listPage[page].map(listAyat => {
            listAyat.words.forEach(word => {
                word.isHidden = this.isItemHidden
                this.maxWordIndex = word.wordPositionInPage
                this.maxAyatIndex = word.ayatPositionInPage
            });
            return listAyat;
        });
    }

    private currentStartupState: StartupState = null

    setStartupState(isItemHidden?: boolean, lastPageOpened?: number, firstItemFocus?: number, currentItemFocus?: number, openMode?: string) {
        if (this.currentStartupState != null) {
            if (isItemHidden) this.currentStartupState.isItemHidden = isItemHidden;
            if (lastPageOpened) this.currentStartupState.lastPageOpened = lastPageOpened;
            if (firstItemFocus != null) this.currentStartupState.firstItemFocus = firstItemFocus;
            if (currentItemFocus != null) this.currentStartupState.currentItemFocus = currentItemFocus;
            if (openMode) this.currentStartupState.openMode = openMode;
        } else {
            this.currentStartupState = {
                isItemHidden,
                lastPageOpened,
                firstItemFocus,
                currentItemFocus,
                openMode
            }
        }
        this.storage.set('startupState', this.currentStartupState);
    }

    getStartupState(): StartupState {
        const startupState: StartupState = this.storage.get('startupState');
        if (startupState != null) {
            this.currentStartupState = startupState;

            this.isItemHidden = startupState.isItemHidden;
            this.openMode = startupState.openMode;
            this.firstItemFocus = startupState.firstItemFocus;
            this.currentFocusItemIndex = startupState.currentItemFocus;

            this.itemFocusSubject.next(this.currentFocusItemIndex);
        }

        return startupState;
    }

    setFirstItemFocus(id: number, ayatIndex: number) {
        if (this.openMode == 'word') {
            this.firstItemFocus = id;
            this.setStartupState(undefined, undefined, id, id);
        } else {
            this.firstItemFocus = ayatIndex;
            this.setStartupState(undefined, undefined, ayatIndex, ayatIndex);
        }

        this.restartItemFocus();
    }

    focusNextItem(): boolean {
        this.currentFocusItemIndex++;
        this.itemFocusSubject.next(this.currentFocusItemIndex);

        if (this.openMode == 'word') {
            return this.currentFocusItemIndex > this.maxWordIndex;
        } else {
            return this.currentFocusItemIndex > this.maxAyatIndex;
        }

    }

    restartItemFocus() {
        this.currentFocusItemIndex = this.firstItemFocus;
        this.itemFocusSubject.next(this.currentFocusItemIndex);
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