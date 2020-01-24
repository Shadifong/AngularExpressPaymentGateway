import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageServicesService {
  productsAmmountInCart = new Subject();

  getProductsFromStorage() {
    const products = localStorage.getItem('products');
    if (products) {
      return JSON.parse(products);
    } else {
      return [];
    }
  }
  appendToStorage(name, newData) {
    let oldData: any = [];
    oldData = JSON.parse(localStorage.getItem(name));
    if (oldData === null) {
      oldData = [];
    }
    if (!Array.isArray(oldData)) {
      Array.from(oldData, Number);
    }
    if (!oldData.includes(newData)) {
      oldData.push(newData);
      localStorage.setItem(name, JSON.stringify(oldData));
      this.productsAmmountInCart.next(oldData.length);
    }
  }

  removeFromStorage(name, id: number) {
    let oldData: any = [];
    let newData;
    oldData = JSON.parse(localStorage.getItem(name));
    if (oldData === null) {
      oldData = [];
    } else {
      newData = oldData.filter(id1 => id1.toString() !== id.toString());
      localStorage.setItem(name, JSON.stringify(newData));
      this.productsAmmountInCart.next(newData.length);
    }
  }

  constructor() {}
}
