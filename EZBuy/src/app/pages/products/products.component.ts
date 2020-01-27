import { Component, OnInit } from '@angular/core';
import { GetProductsService } from '../../shared/services/get-products.service';
import { StorageServicesService } from 'src/app/shared/services/storage-services.service';
import { AutoUnsubscribe } from 'src/app/shared/auto-unsubscribe.decorator';

@AutoUnsubscribe()

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  searchText = '';
  products = [];
  productsInCartNumber = 0;
  currentProductsInCart = 0;
  JSON;


  constructor(public getProductsService: GetProductsService, private storageService: StorageServicesService) {
    this.JSON = JSON;
  }
  ngOnInit() {
    this.storageService.productsAmmountInCart.subscribe((res: any) => {
      this.productsInCartNumber = res;
    });
    this.storageService.productsAmmountInCart.next(
      this.storageService.getProductsFromStorage().length
    );
    this.getProductsService.getProducts().subscribe((result: any) => {
      let result2 = this.storageService.getProductsFromStorage();
      result.products.map((product: any, index) => {
        result.products[index].inCart = result2.includes(product.id);
      });
      this.products = result.products;
    });
  }
  ngOnDestroy() {
  }
}
