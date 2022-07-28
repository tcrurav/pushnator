import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  private myStorage =  new Subject<string>();

  constructor(private storage: Storage) { 
    this.init();
  }

  watchStorage(): Observable<any> {
    return this.myStorage.asObservable();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this._storage?.set(key, value);
    console.log("hola101------------------------------------------")
    this.myStorage.next("changed");
    console.log("hola102------------------------------------------")
  }

  public async get(key: string) {
    return await this._storage?.get(key);
  }
}
