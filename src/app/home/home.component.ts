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
  isPerAyat: string;
  startPage: number;

  constructor(private router: Router, private dataService: DataService) {
    for (let i = 562; i <= 640; i++) {
      this.halaman.push(i);
    }
  }

  ngOnInit() {
  }

  start() {
    if (this.isPerAyat && this.startPage) {
      this.dataService.isOpenPerAyat = this.isPerAyat == 'murojaah';
      this.router.navigate([this.startPage]);
    } else {
      alert('Harap sesuaikan pilihan Anda.');
    }
  }

}
