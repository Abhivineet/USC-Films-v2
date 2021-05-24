import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {Card} from './shared/models/card.model';

@Injectable({providedIn: 'root'})
export class LocalStorageServices{
  constructor() {}

  replacer(key, value): any{
    if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: [...value], // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }

  reviver(key, value): any{
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  isContinueWatchingEmpty(): boolean{
    if (localStorage.getItem('continueWatching') == null){
      return false;
    }
    else{
      return this.getContinueWatching().length > 0;
    }
  }

  getContinueWatching(): any{
    return Array.from(JSON.parse(localStorage.getItem('continueWatching'), this.reviver).values()).reverse();
  }

  putContinueWatching(id: string, object: Card): void{
    let contWatching;
    if (localStorage.getItem('continueWatching') == null){
      localStorage.setItem('continueWatching', JSON.stringify(new Map(), this.replacer));
    }
    contWatching = JSON.parse(localStorage.getItem('continueWatching'), this.reviver);
    if (contWatching.get(id) != null){
      contWatching.delete(id);
    }
    else{
      if (contWatching.size === 24){
        contWatching.delete(Array.from(contWatching.keys())[0]);
      }
    }
    contWatching.set(id, object);

    localStorage.setItem('continueWatching', JSON.stringify(contWatching, this.replacer));
  }

  isInMyList(id: string): boolean{
    let myList;
    if (localStorage.getItem('myList') == null){
      return false;
    }
    myList = JSON.parse(localStorage.getItem('myList'), this.reviver);
    return myList.get(id) != null;
  }

  putInMyList(id: string, object: Card): void{
    let myList;
    if (localStorage.getItem('myList') == null){
      localStorage.setItem('myList', JSON.stringify(new Map(), this.replacer));
    }
    myList = JSON.parse(localStorage.getItem('myList'), this.reviver);
    if (myList.get(id) == null){
      myList.set(id, object);
    }
    localStorage.setItem('myList', JSON.stringify(myList, this.replacer));
  }

  removeFromMyList(id: string): boolean{
    let myList;
    if (localStorage.getItem('myList') == null){
      return false;
    }
    myList = JSON.parse(localStorage.getItem('myList'), this.reviver);
    if (myList.get(id) != null){
      myList.delete(id);
      localStorage.setItem('myList', JSON.stringify(myList, this.replacer));
      return true;
    }
    return false;
  }

  isMyListEmpty(): boolean{
    if (JSON.parse(localStorage.getItem('myList'), this.reviver) === null){
      return true;
    }
    const array = Array.from(JSON.parse(localStorage.getItem('myList'), this.reviver).values());
    return array.length === 0;
  }

  getMyList(): any{
    const array = Array.from(JSON.parse(localStorage.getItem('myList'), this.reviver).values()).reverse();
    if (!this.isMyListEmpty()) {
      return _.chunk(array, 6);
    }
  }
}
