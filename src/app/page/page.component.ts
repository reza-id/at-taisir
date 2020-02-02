import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Ayat } from './ayat/ayat.model';
import { Word } from './ayat/word/word.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  page;
  @Input() side;
  @Input() rehideEvent: Observable<void>;
  
  isLoading = false;
  isError = false;

  private eventsSubscription: Subscription;
  private pageSubscription: Subscription;
  private pageLoadingSubscription: Subscription;  
  private pageErrorSubscription: Subscription;

  pageNumber: string;
  listAyat: Ayat[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.eventsSubscription = this.rehideEvent.subscribe(() => this.rehideAyat());
    const subject = (this.side == 'kiri') ? this.dataService.leftPageChanged : this.dataService.rightPageChanged;
    this.pageSubscription = subject.subscribe(n => {
      this.page = n;
      this.listAyat = this.dataService.getPageContent(n);
      this.pageNumber = `page${n}`;
    });

    const loadingSubject = (this.side == 'kiri') ? this.dataService.leftPageLoading : this.dataService.rightPageLoading;
    this.pageLoadingSubscription = loadingSubject.subscribe(b => this.isLoading = b);

    const errorSubject = (this.side == 'kiri') ? this.dataService.leftPageError : this.dataService.rightPageError;
    this.pageErrorSubscription = errorSubject.subscribe(b => this.isError = b);
  }

  onAyatClick(word: Word) {
    this.dataService.setFirstItemFocus(word.wordPositionInPage, word.ayatPositionInPage);
    if (this.dataService.isItemHidden) {
      let ayatFound = this.listAyat.find(i => i.verse_key == word.verse_key)
      if (ayatFound)
        ayatFound.words.forEach(w => {
          w.isHidden = false;
        });
    }
  }

  rehideAyat() {
    this.listAyat.forEach(ayat => {
      ayat.words.forEach(word => word.isHidden = true);
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
    this.pageLoadingSubscription.unsubscribe();    
    this.pageErrorSubscription.unsubscribe();
  }

}
