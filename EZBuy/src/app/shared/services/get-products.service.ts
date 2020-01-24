import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetProductsService {
  constructor(public http: HttpClient) {}
  getProducts() {
    return this.http.get('http://localhost:7425/getProducts');
  }
  getProductsFromArrayOfIds(ArrayOfIds) {
    return this.http.post(
      'http://localhost:7425/getProductsFromArrayOfIds',
      ArrayOfIds
    );
  }
}
