import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  halaman: number[] = [];
  isPerAyat: string;
  startPage: number;

  constructor(private router: Router) {
    for (let i = 562; i <= 640; i++) {
      this.halaman.push(i);
    }
  }

  ngOnInit() {
  }

  start() {
    if (this.isPerAyat && this.startPage) {
      this.router.navigate([this.startPage], { queryParams: { 'per-ayat': this.isPerAyat == 'murojaah' } });
    } else {
      alert('Harap sesuaikan pilihan Anda.');
    }
  }

}
