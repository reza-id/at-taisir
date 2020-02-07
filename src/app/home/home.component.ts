import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { surahs } from "../surahs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  halaman: number[] = [];
  isHidden: string;
  openMode: string;
  surahs = surahs;
  isReady = false;

  selectedSurah: number;
  totalAyatForselected: number[] = [];
  selectedAyat: number;

  constructor(private router: Router, private dataService: DataService) {
    for (let i = 562; i <= 640; i++) {
      this.halaman.push(i);
    }
  }

  ngOnInit() {
  }

  onSurahSelected(surahIndex: number) {
    this.totalAyatForselected = [];
    for (let i = 1; i <= surahs[surahIndex-1].total; i++) {
      this.totalAyatForselected.push(i);
    }
  }

  checkReady() {
    this.isReady = (this.isHidden && this.selectedSurah && this.selectedAyat && this.openMode) ? true : false;
  }

  async start() {
    this.isReady = false;
    if (this.isHidden && this.selectedAyat && this.openMode) {
      try {
        this.dataService.isItemHidden = this.isHidden == 'murojaah';
        this.dataService.openMode = this.openMode;
        let result = await this.dataService.getPageNumber(this.selectedSurah, this.selectedAyat);

        let itemToFocus = (this.openMode == 'ayat') ? result.ayatPositionInPage : result.wordPositionInPage;
        this.dataService.setFirstItemFocus(result.wordPositionInPage, result.ayatPositionInPage);
        this.dataService.setStartupState(this.isHidden == 'murojaah', result.page_number, itemToFocus, itemToFocus, this.openMode)

        this.router.navigate([result.page_number], { replaceUrl: true });
      } catch (e) {
        this.checkReady();
        alert(e)
      }
    } else {
      alert('Harap sesuaikan pilihan Anda.');
    }
  }

}
