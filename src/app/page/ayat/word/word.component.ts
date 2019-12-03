import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Word } from './word.model';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  // Need to remove view encapsulation so that the custom tooltip style defined in
  // `tooltip-custom-class-example.css` will not be scoped to this component's view.
  encapsulation: ViewEncapsulation.None,
})
export class WordComponent implements OnInit {

  @Input() word: Word
  @Output() wordClick = new EventEmitter<Word>();
  translation = '';
  tooltipclass = 'tooltip-normal';

  constructor() { }

  ngOnInit() {
    if (this.word.translation) {
      this.translation = this.word.translation[0].text;
    }

    if (this.word.isAyatNumber) this.tooltipclass = 'tooltip-red';
  }

  onWordClick() {
    this.wordClick.emit(this.word);
  }

}
