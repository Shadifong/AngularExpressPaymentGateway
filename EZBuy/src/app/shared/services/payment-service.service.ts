import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageServicesService } from './storage-services.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  productsList;
  constructor(private httpClient: HttpClient, private storageServicesService: StorageServicesService) {
    this.productsList = this.storageServicesService.getProductsFromStorage();
  }
  payForProducts(orderID, payerID, total) {
    return this.httpClient.post('http://localhost:7425/pay', {
      orderID,
      payerID,
      total
    });
  }
  payWithStripe(fullToken, price) {
    let token = fullToken.id;
    return this.httpClient.post('http://localhost:7425/stripe', {
      token,
      price
    });
  }
}
