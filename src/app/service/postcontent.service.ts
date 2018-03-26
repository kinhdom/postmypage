import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PostcontentService {

  constructor(private _http: Http) { }
  postUnpublish(image, access_token) {
    // Return media_object_id
  }
  postContent(content, attached_media, access_token) {
    let query = 'https://graph.facebook.com/v2.11/me/feed'
    let option = {
      access_token: access_token,
      message: content,
      attached_media: JSON.stringify(attached_media)
    }
    console.log(option)
    return this._http.post(query, option).map(res => res.json())

  }
}
