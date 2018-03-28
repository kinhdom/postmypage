import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { PostcontentService } from '../service/postcontent.service';



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
        console.log(urlImage)
        this.arrImages.push(urlImage)
      })
    }
  }

  onFormSubmit(form) {
    let formvalue = (form.value)
    let content = formvalue.content
    Object.keys(form.value).map(access_token => {
      console.log(access_token)
      if (formvalue[access_token] === true) {
        this._postcontentservice.postImages(content,this.arrImages, access_token)
      }
      console.log('after')
    })
  }

}
