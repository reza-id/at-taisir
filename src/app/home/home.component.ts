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
  screenWidth: number;

  constructor(private router: Router) {
    for (let i = 562; i <= 640; i++) {
      this.halaman.push(i);
    }
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  start() {
    if (this.isPerAyat && this.startPage) {
      this.router.navigate([this.startPage], { queryParams: { 'per-ayat': this.isPerAyat == 'murojaah' } });
    } else {
      alert('Harap sesuaikan pilihan Anda.');
    }
  }

}
