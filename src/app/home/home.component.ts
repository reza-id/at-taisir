import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  halaman: number[] = [];
  isHidden: string;
  startPage: number;
  openMode: string;

  constructor(private router: Router, private dataService: DataService) {
    for (let i = 562; i <= 640; i++) {
      this.halaman.push(i);
    }
  }

  ngOnInit() {
  }

  start() {
    if (this.isHidden && this.startPage && this.openMode) {
      this.dataService.isItemHidden = this.isHidden == 'murojaah';
      this.dataService.openMode = this.openMode;
      this.dataService.setStartupState(this.isHidden == 'murojaah', this.startPage, 0, 0, this.openMode)

      this.router.navigate([this.startPage], { replaceUrl: true });
    } else {
      alert('Harap sesuaikan pilihan Anda.');
    }
  }

}
