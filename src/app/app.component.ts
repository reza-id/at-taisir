import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Router } from '@angular/router';

declare let FontFace: any;

export interface Section {
  name: string;
  updated: Date;
}

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    const startupState = this.dataService.getStartupState();
    if (startupState) {
      this.router.navigate([startupState.lastPageOpened]);
    }
  }
}
