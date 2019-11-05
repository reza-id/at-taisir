import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ayat } from './ayat/ayat.model';
declare let FontFace: any;

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  @Input() page;
  pageNumber: string;
  listAyat: Ayat[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFont(this.page);
    this.http.get<Ayat[]>(`https://reza-id.herokuapp.com/ayat/${this.page}`)
      .subscribe(data => {
        let listAyat = [];
        let currentLine = 1;
        for (let i = 0; i < data.length; i++) {
          const ayat = data[i];
          const trans = ayat.translations[0];
          for (let j = 0; j < ayat.words.length; j++) {
            if (currentLine != ayat.words[j].line_number) {
              // give <br> tag
              if (ayat.verse_number != 1 || ayat.words[j].position != 1) {
                ayat.words[j].isNewLine = true;
              }
              currentLine = ayat.words[j].line_number;
            }

            if (j == (ayat.words.length - 1)) {
              ayat.words[j].translation = [{
                id: trans.id,
                language_name: trans.language_name,
                text: trans.text,
                resource_id: trans.resource_id
              }];
              ayat.words[j].isAyatNumber = true;
            }
            
            // hide ayat per ayat
            if (currentLine > 3) {
              ayat.words[j].isHidden = true;
            }
          }
          listAyat.push(ayat);
        }
        this.listAyat = listAyat;
      }, error => {
        console.log(error);
      });
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
