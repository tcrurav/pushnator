import { Injectable } from '@angular/core';
//import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  networkConnection = false;

  constructor() { }

  // init(){
  //   Network.addListener('networkStatusChange', status => {
  //     console.log('Network status changed', status);
  //   });
  // }
}
