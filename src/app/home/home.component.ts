import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { PostcontentService } from '../service/postcontent.service';

import { mergeMap } from 'rxjs/operators';

const localToken = 'admin'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  arrPages: Observable<any[]>
  arrImages;
  arrPosted = [];
  selectedImage;
  attached_media;
  percentUploadImage: number;
  constructor(
    private _db: AngularFireDatabase,
    private _storage: AngularFireStorage,
    private _http: Http,
    private _postcontentservice: PostcontentService
  ) { }

  ngOnInit() {
    this.arrPages = this._db.list('postmypage/users/' + localToken + '/pages').valueChanges()
    let arrImages = ['https://dantricdn.com/2017/thu-1504399379412.jpg', 'https://donghuongkontum.files.wordpress.com/2015/09/mc3b9a-thu-vc3a0-c3a1o-tre1baafng.jpeg'];
    let access_token = 'EAAAAUaZA8jlABABmKbLZCdnisGcPKRICrPICC6ZBN0uAIWSCTaC5f8m7ZCgvnrL4a8kEBwf5KVmkoAy6SavclJszD100OSKgHlJjG7YRWfdXxcxm6DowahpLrPL6RfkvAnb2bXcyZBg8rW4m2g57dyp2qDnfPMsHSLGoKfVPiUwZDZD'
    let huy = this._postcontentservice.upImages(arrImages, access_token)
    console.log(huy[0])
    let van = Observable.from(huy[0])
    console.log(van)
    console.log(typeof van + 'van')
    // huy[0].mergeMap(event1 => {
    //   return huy[1].map(event2 => {
    //     console.log(event1)
    //     console.log(event2)
    //   }).subscribe(res => console.log(res))
    // })

  }
  onFileSelected(event) {
    this.attached_media = [];
    this.arrImages = []
    let images = event.target.files
    for (var i = 0; i < images.length; i++) {
      console.log(images[i])
      let taskUpload = this._storage.upload('postmypage/' + localToken + '/' + new Date().getTime(), images[i])
      taskUpload.percentageChanges().subscribe(percent => {
        this.percentUploadImage = Math.round(percent)
      })
      taskUpload.downloadURL().subscribe(urlImage => {
        this.arrImages.push(urlImage)
        // let option = {
        //   access_token: 'EAAAAUaZA8jlABAFeaSeev9b8RuRUdZBg1Ov4xzTyrSABHpUtKucFtqUpCtVacRkRllbFTQrKGTPZA7EtFCt1jYsWP7AWwPB9CA5Ek1BKrmUwC5O8ZCtakpO5IVdj4sJK8mTZCAfoOd42MB8Q0A2kt3cK1u6DEBS4gFZBh3pFziNgZDZD',
        //   published: false,
        //   url: urlImage
        // }
        // this._http.post('https://graph.facebook.com/v2.11/me/photos', option).subscribe(res => {
        //   this.attached_media.push({ media_fbid: res.json().id })
        //   console.log(res.json())
        // })
      })
    }
  }

  onFormSubmit(form) {

    let formvalue = (form.value)
    let content = formvalue.content

    Object.keys(form.value).map(access_token => {
      if (formvalue[access_token] === true) {
        // [{"media_fbid":"838987192964373"},{"media_fbid":"838987192964373"}]
        this._postcontentservice.postContent(content, this.arrImages, access_token)
        // this._postcontentservice.postContent(content, this.arrImages, access_token)
      }
    })
  }

}
