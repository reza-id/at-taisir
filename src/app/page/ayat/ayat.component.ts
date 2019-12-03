import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ayat } from './ayat.model';
import { Word } from './word/word.model';

@Component({
  selector: 'app-ayat',
  templateUrl: './ayat.component.html',
  styleUrls: ['./ayat.component.scss']
})
export class AyatComponent implements OnInit {

  @Input() ayat: Ayat
  @Output() ayatClick = new EventEmitter<Word>();

  constructor() { }

  ngOnInit() {
  }

  onAyatClick(word: Word) {
    this.ayatClick.emit(word);
  }

}
