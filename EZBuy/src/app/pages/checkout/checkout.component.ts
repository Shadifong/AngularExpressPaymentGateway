import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetProductsService } from 'src/app/shared/services/get-products.service';
import { StorageServicesService } from 'src/app/shared/services/storage-services.service';
import { CountryLocationService } from 'src/app/shared/services/country-location.service';
import { SucessComponent } from '../../shared/dialogs/sucess/sucess.component';
import { paymentMethodEnum } from '../../shared/enums/enum';
import { Router } from '@angular/router';
import { PaymentServiceService } from 'src/app/shared/services/payment-service.service';
declare var paypal;
declare var Stripe;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @ViewChild('selectedDropdown', { static: true }) selectedDropdown: ElementRef;
  productsInCart;
  userCountry;
  totalPrice;
  arrayOfObjects;
  orderStatus;
  form;
  locationSub;
  paypalToggle = true;
  enableStripe: any;
  select: any;
  productsArray: any = [];
  PaymentMethods: any = ['Stripe', 'Paypal'];
  defaultPaymentMethod: string;
  paymentMethodEnum = paymentMethodEnum;
  productsFromArrayOfIdsSub: any;

  constructor(
    private storageServicesService: StorageServicesService,
    private getProductsService: GetProductsService,
    private geoLocationService: CountryLocationService,
    private paymentServiceService: PaymentServiceService,
    public dialog: MatDialog,
    public router: Router
  ) { }

  getPaymentMethodAndDefaultPayemntOptions() {
    this.locationSub = this.geoLocationService.getUserCountry().subscribe((res: any) => {
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
  initStripe() {
    const stripe = Stripe('pk_test_m5zsXaoNTqx0C3CUNq1fTZSR00teQwrsiO');
    const elements = stripe.elements();
    const card = elements.create('card', {
      iconStyle: 'solid',
      style: {
        base: {
          iconColor: '#c4f0ff',
          color: '#fff',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',

          ':-webkit-autofill': {
            color: '#fce883',
          },
          '::placeholder': {
            color: '#87BBFD',
          },
        },
        invalid: {
          iconColor: '#FFC7EE',
          color: '#FFC7EE',
        },
      },
    });
    this.form = document.getElementById('payment-form');
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const { token, error } = await stripe.createToken(card);

      if (error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = error.message;
      } else {
        this.stripeTokenHandler(token);
      }
    });

    card.mount('#card-element');

  }
  stripeTokenHandler = (token) => {
    this.paymentServiceService.payWithStripe(token, this.totalPrice).subscribe((res: any) => {
      this.dialog.open(SucessComponent, {
        width: '250px',
        data: { orderStatus: res.charge.status }
      });
    })
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

  ngOnDestroy(): void {
    this.locationSub.unsubscribe();
    this.productsFromArrayOfIdsSub.unsubscribe();
  }
  ngOnInit() {
    this.initStripe();
    this.productsInCart = this.storageServicesService.getProductsFromStorage();
    this.getPaymentMethodAndDefaultPayemntOptions();
    this.getTotalPriceOfProducts();
    this.createPaypalPaymentButton();
    this.productsFromArrayOfIdsSub = this.getProductsService.getProductsFromArrayOfIds(this.productsInCart).subscribe(result => {
      this.arrayOfObjects = result;
    });
  }

}
