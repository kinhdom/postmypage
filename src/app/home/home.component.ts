import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { PostcontentService } from '../service/postcontent.service';
import { DashboardService } from '../service/dashboard.service';

import { LoadingService } from '@swimlane/ngx-ui';
import { NotificationService } from '@swimlane/ngx-ui';
const localToken = 'admin'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  arrPages: Observable<any[]>

  choosePage = false;
  showProgress = false;
  arrImages = [];
  arrPosted = [];
  isVideo = false;
  attached_media;
  percentUploadImage: number;
  constructor(
    private _db: AngularFireDatabase,
    private _storage: AngularFireStorage,
    private _http: Http,
    private _postcontentservice: PostcontentService,
    private _dashboardservice: DashboardService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.arrPages = this._db.list('postmypage/users/' + localToken + '/pages').valueChanges()
  }
  alert(body) {
    this.notificationService.create({
      body: body,
      styleType: 'success',
      timeout: 4000,
      rateLimit: false
    })
  }
  removeImage(img) {
    let position = this.arrImages.indexOf(img)
    this.arrImages.splice(position, 1);
  }
  resetForm(form) {
    form.reset()
    this.arrImages = []
    this.isVideo = false;
  }
  onFileSelected(event) {
    this.attached_media = [];
    let images = event.target.files
    if (images.length) {
      let isTypeVideo = images[0].type.indexOf('video') == 0
      if (isTypeVideo) {
        this.isVideo = true;
        this.arrImages = [];
        console.log('video')
      } else {
        this.isVideo = false
        this.arrImages = []
      }
    } else {
      console.log('Không có file được chọn')
    }

    this.showProgress = true;
    for (var i = 0; i < images.length; i++) {
      let image = {
        url: '',
        percent: ''
      }
      let taskUpload = this._storage.upload('postmypage/' + localToken + '/' + new Date().getTime(), images[i])
      taskUpload.percentageChanges().subscribe(percent => {
        this.percentUploadImage = Math.round(percent)
        this.percentUploadImage == 100 ? this.showProgress = false : this.showProgress = true
      })
      taskUpload.downloadURL().subscribe(urlImage => {
        this.arrImages.push(urlImage)
      })
    }
  }

  onFormSubmit(form) {
    let isPageSelected = Object.values(form.value).indexOf(true)
    if (isPageSelected == -1) {
      console.log('Chưa chọn page')
      this.choosePage = true;
      this.alert('Chọn page muốn đăng')
    } else {
      let formvalue = form.value
      let content = formvalue.content
      if (content || this.arrImages) {
        this.loadingService.start()
        if (this.arrImages.length) {
          Object.keys(form.value).map(access_token => {
            if (formvalue[access_token] === true && access_token != 'chooseAll') {
              if (this.isVideo) {
                let contentVideo = {
                  video: this.arrImages[0],
                  title: formvalue.titleVideo,
                  description: content
                }
                this._postcontentservice.postVideo(contentVideo, access_token, (err, res) => {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      console.log(res)
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })

                })
              } else {
                this._postcontentservice.postImages(content, this.arrImages, access_token, (err, res) => {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      console.log(res)
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })

                })
              }

            }
          })
        } else {
          console.log('Post Text')
          Object.keys(formvalue).map(access_token => {
            if (formvalue[access_token] === true && access_token != 'chooseAll') {
              this._postcontentservice.postStatus(content, access_token, (err, res) => {
                if (err) {
                  this.alert('Fail')
                  this.loadingService.complete()
                } else {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      console.log(res)
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })
                }
              })
            }
          })
        }
      }
    }
  }
}