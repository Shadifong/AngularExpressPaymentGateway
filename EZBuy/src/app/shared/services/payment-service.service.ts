import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageServicesService } from './storage-services.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
   productsList;
  constructor(private httpClient: HttpClient, private storageServicesService: StorageServicesService) {
    this.productsList =  this.storageServicesService.getProductsFromStorage();
  }
  payForProducts(productsList) {
    const products = JSON.stringify(productsList)
    return  this.httpClient.post('http://localhost:7425/pay', {
    products
  });
  }
}
