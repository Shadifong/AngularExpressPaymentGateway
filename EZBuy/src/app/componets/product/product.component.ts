import { Component, OnInit, Input } from '@angular/core';
import { StorageServicesService } from 'src/app/shared/services/storage-services.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: any;

  clicked = false;

  constructor(private storageService: StorageServicesService) {}

  constructProductObject;

  buyButtonClick() {
    this.clicked = !this.clicked;
    if (this.clicked) {
      this.storageService.appendToStorage('products', this.product.id);
    }
    if (!this.clicked) {
      const products = localStorage.getItem('products');
      if (products && products.length !== 0) {
        this.storageService.removeFromStorage('products', this.product.id);
      }
    }
  }

  ngOnInit() {
    this.product = JSON.parse(this.product);
    this.product.imageSrc = `url(${this.product.src})`;
    this.clicked = this.product.inCart;
  }
}
