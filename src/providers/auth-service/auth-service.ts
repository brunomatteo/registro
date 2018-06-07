import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as md5 from 'md5'; //importa pacchetto per hash
import { Storage } from '@ionic/storage';
export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
//servizio di autenticazione
@Injectable()
export class AuthService {
  currentUser: User;
  constructor(private storage: Storage){}
  //metodo che controlla se le credenziali esistono
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {




        this.storage.get(credentials.email).then(password => {
          if(md5(credentials.password) == password){
            observer.next(true);
          } else{
            observer.next(false);
          }
        this.currentUser = new User(credentials.email,credentials.email);
        observer.complete();
      });
    });
  }
}
//metodo per la registrazione delle credenziali
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.storage.set(credentials.email, md5(credentials.password)).then(val => {
          if(val){
            observer.next(true);
            observer.complete();
          } else{
            observer.next(false);
            observer.complete();
          }
        });

      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
