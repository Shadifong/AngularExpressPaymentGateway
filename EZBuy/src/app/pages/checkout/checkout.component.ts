import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProductsService } from 'src/app/shared/services/get-products.service';
import { StorageServicesService } from 'src/app/shared/services/storage-services.service';
import { CountryLocationService } from 'src/app/shared/services/country-location.service';
import { SucessComponent } from '../../shared/dialogs/sucess/sucess.component';
import { paymentMethodEnum } from '../../shared/enums/enum'
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
  hide = true;
  enablePaypal = false;
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
    public dialog: MatDialog
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
      }
    });
  }
  onSelect(text: any) {
    this.select = text.srcElement.selectedIndex;
    this.checkPaymentMethod();
  }
  pay(amount) {
    const handler = StripeCheckout.configure({
      key: 'pk_test_m5zsXaoNTqx0C3CUNq1fTZSR00teQwrsiO',
      locale: 'auto',
      token(token: any) {
        console.log(token);
      }
    });

    handler.open({
      name: 'Stripe Payment',
      description: `Purchase with a total of ${amount}`,
    });

  }
  checkPaymentMethod() {
    if (this.defaultPaymentMethod === 'Stripe' || this.select == 1 || this.totalPrice == 0) {
      this.hide = true;
    } else {
      this.hide = false;
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
          let purchase_units = this.arrayOfObjects.reduce((acc, currentValue) => {
            acc.push({
              description: currentValue.description,
              amount: {
                currency_code: 'USD',
                value: currentValue.price
              }
            });
            return acc;
          }, []);
          return actions.order.create({
            purchase_units
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.orderStatus = order.status;
          this.dialog.open(SucessComponent, {
            width: '250px',
            data: { orderStatus: this.orderStatus }
          });
        },
        onError: err => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }


  ngOnInit() {
    this.checkPaymentMethod();
    this.productsInCart = this.storageServicesService.getProductsFromStorage();
    this.getPaymentMethodAndDefaultPayemntOptions();
    this.getTotalPriceOfProducts();
    this.createPaypalPaymentButton();
    this.getProductsService.getProductsFromArrayOfIds(this.productsInCart).subscribe(result => {
      this.arrayOfObjects = result;
    });
  }
}
