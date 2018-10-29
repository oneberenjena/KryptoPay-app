import { LoginProvider } from './../../providers/login/login';
import { WorkerProvider } from './../../providers/worker/worker';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: AbstractControl;
  password: AbstractControl;
  loginForm: FormGroup;
  worker: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loginProvider: LoginProvider,
    public workerProvider: WorkerProvider,
    private storage: Storage
  ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.loginProvider.loginUser({
      username: this.username.value,
      password: this.password.value
    })
      .subscribe(response => this.getWorker(
        response, this.username.value)
      );
  }

  getWorker(loginResponse: any, username: string) {
    if (!loginResponse.success) {
      return;
    }

    this.workerProvider.getWorker(this.username.value)
      .subscribe(worker => {
        this.worker = worker;
        // console.log(this.worker);
        if (this.storage.ready()) {
          console.log(this.worker);
          this.storage.set('worker', this.worker);
          console.log(this.storage.get('worker'));
          this.navCtrl.goToRoot();
        }
      });
  }
}