import { Component, OnInit } from '@angular/core';
import { PagesService } from '../service/pages.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from '@swimlane/ngx-ui';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
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
  constructor(
    private _pagesService: PagesService,
    private _db: AngularFireDatabase,
    private notificationService: NotificationService,
    private _router: Router,
    private _loginservice: LoginService
  ) { }

  ngOnInit() { }
  onFormSubmit(form) {
    let html = form.value.code
    if (html) {
      let htmltext = this._pagesService.html2text(html)
      // Tach Token
      let x = htmltext.indexOf('EAAAA')
      let token1 = htmltext.substr(x, 200)
      let y = token1.indexOf("\"")
      let access_token = token1.substr(0, y)
      if (access_token) {
        this._pagesService.getAllPage(access_token).subscribe(arrPages => {
          this._db.list('postmypage/users/' + localToken).set('access_token', access_token)
          this._db.list('postmypage/users/' + localToken).set('pages', arrPages)
          this._db.list('postmypage/users/' + localToken).set('access_token', access_token)
          window.location.href = '/'
        })
      } else {
        console.log('Ko có accesstoken')
        this._loginservice.alert('Code không hợp lệ, hãy nhớ đăng nhập facebook và làm lại theo hướng dẫn')
      }
    } else {
      this._loginservice.alert('Hãy nhập mã code theo hướng dẫn trước khi submit')
    }
  }
}
