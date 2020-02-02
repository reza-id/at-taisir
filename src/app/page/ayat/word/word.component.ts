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
  isHighlight = false;

  unhideSubs: Subscription;

  @ViewChild(MatTooltip, { static: true }) tooltip: MatTooltip;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.word.translation) {
      this.translation = this.word.translation[0].text;
    }

    if (this.word.isAyatNumber) this.tooltipclass = 'tooltip-red';
    this.unhideSubs = this.dataService.itemFocusSubject.subscribe(n => {
      if (this.dataService.openMode == 'ayat') {
        if (n == this.word.ayatPositionInPage) {
          this.word.isHidden = false;
          this.isHighlight = true;
          if (this.word.isAyatNumber) this.tooltip.show();
        } else {
          this.isHighlight = false;
          this.tooltip.hide();
        }
      } else {
        if (n == this.word.wordPositionInPage) {
          this.tooltip.show();
          this.word.isHidden = false;
          this.isHighlight = true;
        } else {
          this.isHighlight = false;
          this.tooltip.hide();
        }
      }
    });
  }

  onWordClick() {
    this.wordClick.emit(this.word);
  }

  ngOnDestroy() {
    this.unhideSubs.unsubscribe();
  }

}
