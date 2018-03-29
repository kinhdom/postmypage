import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
// Ngx ui
import { NgxUIModule } from '@swimlane/ngx-ui';
// Angularfire2
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireStorageModule} from 'angularfire2/storage';

import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages/pages.component';
// Service
import {PagesService} from './service/pages.service';
import {DashboardService} from './service/dashboard.service';
import {PostcontentService} from './service/postcontent.service';
import { DetailpageComponent } from './dashboard/detailpage/detailpage.component';
import {DetailpageService} from './service/detailpage.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    HomeComponent,
    PagesComponent,
    DetailpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxUIModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule
  ],
  providers: [PagesService,DashboardService,PostcontentService,DetailpageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
