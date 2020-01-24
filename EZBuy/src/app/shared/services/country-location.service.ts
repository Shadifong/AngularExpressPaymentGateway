import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root"
})
export class CountryLocationService {
  geoLocationApiUrl = "https://ipinfo.io/?token";
  getUserCountry() {
    return this.httpClient.get(
      `${this.geoLocationApiUrl}=${environment.geoLocationToken}`
    );
  }

  defaultApiMethod(countryCode) {
    if (countryCode == "IL") {
      return "Paypal";
    } else if (countryCode == "US") {
      return "Stripe";
    }
  }

  constructor(private httpClient: HttpClient) {}
}
