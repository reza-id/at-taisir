import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Word } from './word.model';
import { MatTooltip } from '@angular/material';
import { DataService } from 'src/app/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  // Need to remove view encapsulation so that the custom tooltip style defined in
  // `tooltip-custom-class-example.css` will not be scoped to this component's view.
  encapsulation: ViewEncapsulation.None,
})
export class WordComponent implements OnInit, OnDestroy {

  @Input() word: Word
  @Output() wordClick = new EventEmitter<Word>();
  translation = '';
  tooltipclass = 'tooltip-normal';

  unhideSubs: Subscription;

  @ViewChild(MatTooltip, {static: true}) tooltip: MatTooltip;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.word.translation) {
      this.translation = this.word.translation[0].text;
    }

    if (this.word.isAyatNumber) this.tooltipclass = 'tooltip-red';
    this.unhideSubs = this.dataService.wordFocusSubject.subscribe(n => {
      if (n == this.word.id) {
        this.tooltip.show();
        this.word.isHidden = false;
      } else {
        this.tooltip.hide();
      }
    });
  }

  onWordClick() {
    this.wordClick.emit(this.word);
  }

  ngOnDestroy() {

  }

}
