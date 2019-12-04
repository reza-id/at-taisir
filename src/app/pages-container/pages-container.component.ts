import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pages-container',
  templateUrl: './pages-container.component.html',
  styleUrls: ['./pages-container.component.scss']
})
export class PagesContainerComponent implements OnInit {

  @Input() isOpenPerAyat = true;
  rehideSubject: Subject<void> = new Subject<void>();

  page: number;
  isOdd: boolean;

  kiri: number;
  kanan: number;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.page = +this.route.snapshot.params['page'];
    this.isOpenPerAyat = this.route.snapshot.queryParams['per-ayat'] == 'true';
    this.reloadPage();

    this.route.params
      .subscribe(
        (params: Params) => {
          this.page = +params['page'];
          this.reloadPage();
        }
      );
      this.route.queryParams.subscribe(
        (params: Params) => {
          this.isOpenPerAyat = params['per-ayat'] == 'true';
        }
      );
  }

  private reloadPage() {
    this.isOdd = this.page % 2 != 0;
    if (this.isOdd) {
      this.kanan = this.page;
      this.kiri = this.page + 1;
    } else {
      this.kiri = this.page;
      this.kanan = this.page - 1;
    }
  }

  nextPage() {
    this.router.navigate([this.kiri+1], { queryParamsHandling: "merge" });
  }

  prevPage() {
    this.router.navigate([this.kanan-1], { queryParamsHandling: "merge"});
  }

  rehide() {
    this.rehideSubject.next();
  }

}
