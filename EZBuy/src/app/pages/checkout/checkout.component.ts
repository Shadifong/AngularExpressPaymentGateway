import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProductsService } from 'src/app/shared/services/get-products.service';
import { StorageServicesService } from 'src/app/shared/services/storage-services.service';
import { CountryLocationService } from 'src/app/shared/services/country-location.service';
import { SucessComponent } from '../../shared/dialogs/sucess/sucess.component';
import { paymentMethodEnum } from '../../shared/enums/enum';
import { Router } from '@angular/router';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
declare var paypal;
declare var StripeCheckout;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @ViewChild('selectedDropdown', { static: true }) selectedDropdown: ElementRef;
  productsInCart;
  userCountry;
  totalPrice;
  arrayOfObjects;
  orderStatus;
  paypalToggle = true;
  enableStripe: any;
  select: any;
  productsArray: any = [];
  PaymentMethods: any = ['Stripe', 'Paypal'];
  defaultPaymentMethod: string;
  paymentMethodEnum = paymentMethodEnum;

  constructor(
    private storageServicesService: StorageServicesService,
    private getProductsService: GetProductsService,
    private geoLocationService: CountryLocationService,
    private paymentServiceService: PaymentServiceService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  getPaymentMethodAndDefaultPayemntOptions() {
    this.geoLocationService.getUserCountry().subscribe((res: any) => {
      if (res) {
        this.userCountry = res.country;
        this.defaultPaymentMethod = this.geoLocationService.defaultApiMethod(
          this.userCountry
        );
        this.PaymentMethods = this.PaymentMethods.filter(
          o => o !== this.defaultPaymentMethod
        );
        this.select = this.defaultPaymentMethod;

      }
    });
  }
  onSelect(text: any) {
    this.select = text.srcElement.value;
    this.checkPaymentMethod();
  }
  payWithStripe(amount) {
    const handler = StripeCheckout.configure({
      key: 'pk_test_m5zsXaoNTqx0C3CUNq1fTZSR00teQwrsiO',
      locale: 'auto',
      token(token: any) {
        console.log(token);
      }
    });

    handler.open({
      name: 'Stripe Payment',
      description: `Purchase with a total of ${amount}$`,
    });

  }
  checkPaymentMethod() {
    if (this.defaultPaymentMethod && this.defaultPaymentMethod === 'Stripe' || this.select === 'Stripe' || this.totalPrice === 0) {
      this.paypalToggle = true;
    } else {
      this.paypalToggle = false;
    }
  }
  getTotalPriceOfProducts() {
    this.getProductsService
      .getProductsFromArrayOfIds(this.productsInCart)
      .subscribe((result: any) => {
        this.productsArray = result;
        this.totalPrice = 0;
        result.map(({ price }) => (this.totalPrice += price));
      });
  }

  createPaypalPaymentButton() {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: this.totalPrice
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          this.paymentServiceService.payForProducts(data.orderID, data.payerID, this.totalPrice).subscribe((order: any) => {
            this.orderStatus = order.body.status;
            if (this.orderStatus) {
              this.dialog.open(SucessComponent, {
                width: '250px',
                data: { orderStatus: this.orderStatus }
              });
            }
          })
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }


  ngOnInit() {
    this.productsInCart = this.storageServicesService.getProductsFromStorage();
    this.getPaymentMethodAndDefaultPayemntOptions();
    this.getTotalPriceOfProducts();
    this.createPaypalPaymentButton();
    this.getProductsService.getProductsFromArrayOfIds(this.productsInCart).subscribe(result => {
      this.arrayOfObjects = result;
    });
  }
}
