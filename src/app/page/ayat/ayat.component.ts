import { Component, OnInit, Input } from '@angular/core';
import { Ayat } from './ayat.model';

@Component({
  selector: 'app-ayat',
  templateUrl: './ayat.component.html',
  styleUrls: ['./ayat.component.scss']
})
export class AyatComponent implements OnInit {

  @Input() ayat: Ayat

  constructor() { }

  ngOnInit() {
  }

}
