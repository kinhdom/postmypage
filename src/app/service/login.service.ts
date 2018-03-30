import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AlertService } from '@swimlane/ngx-ui';

@Injectable()
export class LoginService {

  constructor(private _db: AngularFireDatabase,
    private alertService: AlertService) { }
  getLocalToken() {
    return localStorage.getItem('token')
  }
  alert(message) {
    this.alertService.alert({
      title: 'Fail',
      style: 'warning',
      content: message
    })
  }
  addUser(token, password, callback) {
    this._db.list('postmypage').valueChanges().subscribe(res => {
      let usersJson = JSON.parse(JSON.stringify(res[0]))
      let positionTokenInArray = Object.keys(usersJson).indexOf(token)
      console.log(positionTokenInArray)
      if (positionTokenInArray == -1) {
        callback(undefined, false)
        console.log('Add User Fail')
      } else {
        localStorage.setItem('token', 'admin')
        this._db.list('postmypage/users/').update(token, { password: password })
        console.log('Add User Success')
        callback(undefined, true)
      }
    })
  }
}
