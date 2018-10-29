import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from "@angular/common/http";

import { MyApp } from './app.component';
import { LoginPage } from './../pages/login/login';
import { HomePage } from '../pages/home/home';
import { BalancePage } from './../pages/balance/balance';
import { TasasPage } from './../pages/tasas/tasas';
import { CalculatorPage } from './../pages/calculator/calculator';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FeesProvider } from '../providers/fees/fees';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginProvider } from '../providers/login/login';
import { CryptoCurrenciesProvider } from '../providers/crypto-currencies/crypto-currencies';
import { WorkerProvider } from '../providers/worker/worker';

import { IonicStorageModule } from "@ionic/storage";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CalculatorPage,
    TasasPage,
    BalancePage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CalculatorPage,
    TasasPage,
    BalancePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeesProvider,
    LoginProvider,
    CryptoCurrenciesProvider,
    WorkerProvider
  ]
})
export class AppModule {}
