import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { async } from '@firebase/util';
import { forEachAsync } from 'forEachAsync';
import { forkJoin } from 'rxjs/observable/forkJoin';
const localToken = localStorage.getItem('token')
@Injectable()
export class PostcontentService {
  constructor(private _http: Http, private _db: AngularFireDatabase) { }
  uploadOneImage(url_image, access_token) {
    let option = {
      access_token: access_token,
      published: false,
      url: url_image
    }
    return this._http.post('https://graph.facebook.com/v2.11/me/photos', option)
  }
  uploadImages(arrImages, access_token, callback) {
    let arrRes = []
    arrImages.forEach(async image => {
      arrRes.push(this.uploadOneImage(image, access_token))
    });
    forkJoin(arrRes).subscribe(res => {
      let huy = JSON.parse(JSON.stringify(res))
      let attached_media = []
      huy.forEach(res => {
        attached_media.push({ media_fbid: JSON.parse(res._body).id })
      });
      callback(undefined, attached_media)
    })
  }
  postStatus(content, access_token,callback) {
    let option = {
      access_token: access_token,
      message: content
    }
    let query = 'https://graph.facebook.com/v2.11/me/feed'
    this._http.post(query, option).map(res => res.json()).subscribe(res => {
      callback(undefined,res)
    })
  }
  postImages(content, arrImages, access_token, callback) {
    this.uploadImages(arrImages, access_token, (err, attached_media) => {
      let option = {
        access_token: access_token,
        message: content,
        attached_media: attached_media
      }
      let query = 'https://graph.facebook.com/v2.11/me/feed'
      this._http.post(query, option).map(res => res.json()).subscribe(res => {
        callback(undefined, res)
      })
    })
  }
  postVideo(content, access_token,callback) {
    let option = {
      access_token: access_token,
      file_url: content.video,
      title: content.title,
      description: content.description
    }
    let query = 'https://graph.facebook.com/v2.11/me/videos'
    this._http.post(query, option).map(res => res.json()).subscribe(res => {
      callback(undefined,res)
    })
  }
}

