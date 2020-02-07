import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { DataService } from '../data.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38
}

@Component({
  selector: 'app-pages-container',
  templateUrl: './pages-container.component.html',
  styleUrls: ['./pages-container.component.scss']
})
export class PagesContainerComponent implements OnInit {

  rehideSubject: Subject<void> = new Subject<void>();

  isItemHidden = true;

  page: number;
  isOdd: boolean;

  kiri: number;
  kanan: number;

  constructor(private router: Router, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    if (this.route.snapshot.url[0].path == 'notif') {
      this.dataService.setFirstItemFocus(0, this.route.snapshot.params['position']);
      this.dataService.openMode = 'ayat';
      this.dataService.isItemHidden = true;
    }
    this.isItemHidden = this.dataService.isItemHidden;
    this.route.params
      .subscribe(
        (params: Params) => {
          this.page = +params['page'];
          this.reloadPage();
        }
      );
  }

  private reloadPage() {
    this.isOdd = this.page % 2 != 0;
    if (this.isOdd) {
      this.kanan = this.page;
      this.kiri = this.page + 1;
    } else {
      this.kiri = this.page;
      this.kanan = this.page - 1;
    }
    this.dataService.loadPage(this.kanan);
    this.dataService.loadPage(this.kiri);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.dataService.restartItemFocus();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.openNextHidden();
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.rehide();
    }
  }

  nextPage() {
    this.dataService.setFirstItemFocus(0, 0);
    this.router.navigate([this.kiri + 1], { queryParamsHandling: "merge", replaceUrl: true });
  }

  prevPage() {    
    this.dataService.setFirstItemFocus(0, 0);
    this.router.navigate([this.kanan - 1], { queryParamsHandling: "merge", replaceUrl: true });
  }

  rehide() {
    this.rehideSubject.next();
  }

  restartFocus() {
    this.dataService.restartItemFocus();
  }

  openNextHidden() {
    const shouldOpenNextPage = this.dataService.focusNextItem();
    if (shouldOpenNextPage) {
      this.nextPage();
      this.dataService.setStartupState(this.dataService.isItemHidden, this.kanan, 0, 0);
    }
  }
}
