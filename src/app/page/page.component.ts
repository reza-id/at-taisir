import { Component, OnInit, Input } from '@angular/core';
declare let FontFace: any;

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Input() page;
  pageNumber: string;
  text: string;

  ngOnInit() {
    this.loadFont(this.page);
    if (this.page == '3') {
      this.text = 'ﭑ ﭒ ﭓ ﭔ ﭕ ﭖ ﭗ ﭘ ﭙ<br>ﭚ ﭛ ﭜﭝ ﭞ ﭟ ﭠ ﭡ ﭢ ﭣﭤ<br>ﭥ ﭦ ﭧﭨ ﭩ ﭪ ﭫﭬ ﭭ<br>ﭮ ﭯ ﭰ ﭱ ﭲ ﭳ ﭴ ﭵ ﭶ ﭷ<br>ﭸ ﭹ ﭺ ﭻ ﭼ ﭽ ﭾ ﭿ<br>ﮀ ﮁ ﮂﮃ ﮄ ﮅ ﮆ ﮇ ﮈ ﮉ<br>ﮊ ﮋ ﮌ ﮍ ﮎ ﮏ ﮐﮑ ﮒ ﮓ<br>ﮔ ﮕ ﮖ ﮗ ﮘ ﮙ ﮚ ﮛ ﮜ<br>ﮝ ﮞ ﮟ ﮠ ﮡ ﮢ ﮣ ﮤﮥ ﮦ<br>ﮧ ﮨ ﮩ ﮪ ﮫ ﮬ ﮭ ﮮ ﮯ ﮰ ﮱ<br>ﯓ ﯔ ﯕ ﯖ ﯗ ﯘ ﯙ ﯚﯛ ﯜ<br>ﯝ ﯞ ﯟ ﯠ ﯡ ﯢ ﯣ ﯤ ﯥ ﯦ <br>ﯧ ﯨ ﯩ ﯪ ﯫﯬ ﯭ ﯮ ﯯ<br>ﯰ ﯱ ﯲ ﯳﯴ ﯵ ﯶ ﯷ<br>ﯸ ﯹ ﯺ ﯻ ﯼ ﯽ ﯾ ﯿ<br>';
    } else {
      this.text = 'ﭑ ﭒ ﭓ ﭔ ﭕ ﭖ ﭗ ﭘ ﭙ<br>ﭚ ﭛ ﭜ ﭝ ﭞ ﭟ ﭠ ﭡ ﭢﭣ<br>ﭤ ﭥ ﭦ ﭧ ﭨ ﭩﭪ ﭫ ﭬ ﭭ ﭮ<br>ﭯ ﭰ ﭱ ﭲ ﭳ ﭴ ﭵ ﭶ ﭷ<br>ﭸ ﭹ ﭺﭻ ﭼ ﭽ ﭾﭿ ﮀ ﮁ<br>ﮂ ﮃﮄ ﮅ ﮆ ﮇ ﮈ ﮉ ﮊ ﮋ ﮌ ﮍ<br>ﮎ ﮏ ﮐ ﮑ ﮒ ﮓ ﮔﮕ ﮖ ﮗ ﮘ<br>ﮙ ﮚ ﮛﮜ ﮝ ﮞ ﮟ ﮠ ﮡ <br>ﮢ ﮣ ﮤ ﮥ ﮦ ﮧﮨ ﮩ ﮪ<br>ﮫ ﮬ ﮭ ﮮ ﮯ ﮰ ﮱ ﯓ ﯔ <br>ﯕ ﯖ ﯗ ﯘ ﯙ ﯚﯛ ﯜ ﯝ ﯞ ﯟ <br>ﯠ ﯡﯢ ﯣ ﯤ ﯥ ﯦ ﯧ ﯨ ﯩ <br>ﯪ ﯫ ﯬ ﯭ ﯮ ﯯ ﯰ ﯱ ﯲ <br>ﯳ ﯴ ﯵ ﯶﯷ ﯸ ﯹ ﯺ ﯻ ﯼ <br>ﯽ ﯾ ﯿ ﰀ ﰁ ﰂﰃ ﰄ ﰅ';
    }
  }

  loadFont(page: string) {
    this.pageNumber = `page${page}`;
    let customFont = new FontFace(this.pageNumber, `url(https://quran-1f14.kxcdn.com/fonts/ttf/p${page}.ttf)`);
    customFont.load().then((res) => {
      document['fonts'].add(res);
    }).catch((error) => {
      console.log(error);
    });
  }

}
