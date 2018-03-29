import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PagesService {
  arrPages = [];
  constructor(private _http: Http) { }
  getAllPage(access_token) {
    console.log('getAllPage service')
    let query = 'https://graph.facebook.com/me/accounts?limit=1000&access_token=' + access_token
    return this._http.get(query).map(res => res.json().data)
  }
  getInfoPage(access_token) {
    let query = 'https://graph.facebook.com/me?access_token=' + access_token
    return this._http.get(query).map(res => res.json())
  }
  html2text(html) {
    var tag = document.createElement('div');
    tag.innerHTML = html;
    return tag.innerText;
  }
}
