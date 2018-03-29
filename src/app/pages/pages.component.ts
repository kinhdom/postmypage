import { Component, OnInit } from '@angular/core';
import { PagesService } from '../service/pages.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from '@swimlane/ngx-ui';
import { Observable } from 'rxjs/Observable';

// Nho sua lai nha
const localToken = 'admin'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  code;
  isAdd: boolean = false;
  arrPages: Observable<any[]>;
  constructor(
    private _pagesService: PagesService,
    private _db: AngularFireDatabase,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.arrPages = this._db.list('postmypage/users/' + localToken + '/pages').valueChanges()
  }
  onFormSubmit(form) {
    let html = form.value.code
    let htmltext = this._pagesService.html2text(html)
    // Tach Token
    let x = htmltext.indexOf('EAAAA')
    let token1 = htmltext.substr(x, 200)
    let y = token1.indexOf("\"")
    let access_token = token1.substr(0, y)

    this._pagesService.getAllPage(access_token).subscribe(arrPages => {
      this._db.list('postmypage/users/' + localToken).set('pages', arrPages),
      this._db.list('postmypage/users/' + localToken).set('access_token', access_token)
    })
  }


}
