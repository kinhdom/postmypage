import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private _loginservice: LoginService,
    private _router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    let token = this._loginservice.getLocalToken()
    if (token) {
      this._router.navigate(['/pages'])
    } else {
      console.log('not login')
    }
  }
  
  onFormSubmit(from) {
    let formvalue = from.value
    if (formvalue.token && formvalue.password) {
      this._loginservice.addUser(formvalue.token, formvalue.password, (err, success) => {
        if (success) {
          window.location.reload()
        } else {
          this._loginservice.alert('Nhập sai key')
        }
      })
    } else {
      this._loginservice.alert('Hãy nhập key và password')
    }

  }

}
