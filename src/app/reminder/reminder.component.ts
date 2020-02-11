import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',  
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  displayToken: string;
  constructor(updates: SwUpdate) {
    updates.available.subscribe(_ => updates.activateUpdate().then(() => {
      console.log('reload for update');
      document.location.reload();
    }));
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
      navigator.serviceWorker.getRegistration().then(swr => firebase.messaging().useServiceWorker(swr));
    }
  }

  ngOnInit() {
    console.log(Notification.permission);
  }

  permitToNotify() {
    if (Notification.permission == 'default' || Notification.permission == 'granted') {
      const messaging = firebase.messaging();
      messaging.requestPermission()
        .then(() => messaging.getToken().then(token => this.displayToken = token))
        .catch(err => {
          alert('Notifikasi untuk situs ini telah Anda blokir, silahkan buka pengaturan dan izinkan notifikasi.');
          console.log('Unable to get permission to notify.', err);
        });
    } else if (Notification.permission == 'denied') {
      alert('Notifikasi untuk situs ini telah Anda blokir, silahkan buka pengaturan dan izinkan notifikasi.');
    }
    
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

}
