import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { async } from '@firebase/util';
import { forEachAsync } from 'forEachAsync';

const localToken = localStorage.getItem('token')
@Injectable()
export class PostcontentService {
  attached_media = [];
  constructor(private _http: Http, private _db: AngularFireDatabase) { }
  upOneImage(url_image, access_token) {
    let option = {
      access_token: access_token,
      published: false,
      url: url_image
    }
    return this._http.post('https://graph.facebook.com/v2.11/me/photos', option)
  }
  upImages(arrImages, access_token) {
    let arrRes = []
    arrImages.forEach(async image => {
      arrRes.push(this.upOneImage(image, access_token))
    });
    return arrRes
  }

  createArr(res) {
    let arr = []
    res.forEach(async element => {
      console.log('before')
      let huy = await this.convert(element)
      console.log(huy)
      console.log('after')
    });
  }
  convert(dataObservable) {
    return Promise.resolve(dataObservable.subscribe(res => res.json()))
  }
  // upimage(arrImages) //Return arr obj_fbid
  // .then(upContent)
  // .catch(ket_qua)


  postContent(content, arrImages, access_token) {
    let arr_attached_media = []
    arrImages.forEach((image, index) => {
      let option = {
        access_token: access_token,
        published: false,
        url: image
      }
      this._http.post('https://graph.facebook.com/v2.11/me/photos', option).subscribe(res => {
        arr_attached_media.push({ media_fbid: res.json().id })
      })
      if (index == arrImages.length - 1) {
        let option_feed = {
          access_token: access_token,
          message: content,
          attached_media: arr_attached_media
        }
        let query = 'https://graph.facebook.com/v2.11/me/feed'
        this._http.post(query, option_feed).map(res => res.json()).subscribe(res => {
          console.log(res)
        })
      }
    });
  }
}








function getIdImage(arrayImage) {
  let arrayIdImage = [];
  arrayImage.forEach(image => {
    this._http.post('myserver.com', {}).subscribe(id => {
      arrayIdImage.push(id)
    })
  });
  return arrayIdImage;
}