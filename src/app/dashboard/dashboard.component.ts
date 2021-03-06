import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myPages = [];

  constructor(private _dashboardservice: DashboardService) { }

  ngOnInit() {
    this._dashboardservice.getMyPages().subscribe(pages => {
      pages.forEach(page => {
        let access_token = JSON.parse(JSON.stringify(page)).access_token
        this._dashboardservice.getInfoPage(access_token, (err, info) => {
          if (err) throw err
          this.myPages.push(info)
        })
      });

    })
  }
}
