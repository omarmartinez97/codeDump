import {NavController, Events, ViewController, Slides, Modal, NavParams} from 'ionic-angular';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core'
import { UserService } from "../../services/user-service";
import { ItinerariesService } from "../../services/itinerary-service";
import { DateService } from "../../services/date-service";
import { BasePage } from '../base-page';
import { DatePicker } from '@ionic-native/date-picker';
import * as moment from "moment";

// pipes
import { MomentPipe } from "../../pipes/moment.pipe";
import { SearchPipe } from "../../pipes/search.pipe";
import { OrderByPipe } from "../../pipes/orderby.pipe";

@Component({
    templateUrl: 'create-itinerary.html', 
    providers:[DateService,DatePicker,ItinerariesService]   
})
export class CreateItineraryPage extends BasePage {
    public itineraryFlight: any;
    public itineraryTypeDictionary: {};
    public userId: any;

    labels: any = {};
    public itinerary: any = {};
    public showType:Boolean = false;
    private countriesDepartureVisible: boolean = false;
    private countriesArrivalVisible: boolean = false;
    private countries: any = [];

    public countriesNameList: Array<any> = [
        "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Caribbean Netherlands", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros",
        "Congo (Brazzaville)", "Congo (Kinshasa)", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Honduras", "Hong Kong S.A.R., China", "Hungary", "Iceland",
        "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao S.A.R., China", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar",
        "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territory", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten",
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
    ];

    @ViewChild("createItineraries") createItineraries:any;
    
    constructor(private nav: NavController,
                private navParams:NavParams,
                private dateService: DateService,
                private datePicker: DatePicker,
                private itinerariesService: ItinerariesService
                ) {
        super();

        this.itineraryTypeDictionary = {
            "1" : "Flight",
            "2" : "Bus",
            "3" : "Train",
            "4" : "Taxi",
            "5" : "Ride",
            "6" : "Walk",
            "7" : "Bike",
            "8" : "Motorcycle",
            "9" : "Metro"
        }

        this.itineraryFlight = this.navParams.get('itinerary');
        this.itineraryFlight.departureDate = moment(this.itineraryFlight.departureDate);
        this.itineraryFlight.arrivalDate = moment(this.itineraryFlight.arrivalDate);

        this.userId = this.itineraryFlight.userId;
        this.itineraryFlight.departureTime = moment(this.itineraryFlight.departureDate, "hh:mm");
        this.itineraryFlight.arrivalTime = moment(this.itineraryFlight.arrivalDate, "hh:mm");

        this.initCountries();
    }

    ionViewDidEnter() {
        this.onPageDidEnterBase();
    }

    toogleShowType(){
        this.showType = !this.showType;
    }

    private initCountries(): void {
        this.countriesNameList.forEach((country) => {
            this.countries.push({name: country});
        });
    }

    selectType(ev){
        this.itineraryFlight.itineraryType = ev.target.attributes[0].value;
        this.toogleShowType();
    }

    public changeDepartureDate(){
        var options = {
            date: new Date(),
            mode: 'date'
        };

        this.datePicker.show(options).then((date) => {
            console.log(date);
            this.itineraryFlight.departureDate = date;
        }, (error) => {
            console.log(error);
        });
    }

     public changeDepartureTime(){
        var options = {
            date: new Date(),
            mode: 'time'
         };

        this.datePicker.show(options).then((time) => {
            console.log(time);
            this.itineraryFlight.departureTime = time;
        }, (error) => {
            console.log(error);
        });
    }

    
    public changeArrivalDate(){
        var options = {
            date: new Date(),
            mode: 'date'
        };

        this.datePicker.show(options).then((date) => {
            console.log(date);
            this.itineraryFlight.arrivalDate = date;
        }, (error) => {
            console.log(error);
        });
    }

     public changeArrivalTime(){
        var options = {
            date: new Date(),
            mode: 'time'
        };

        this.datePicker.show(options).then((time) => {
            console.log(time);
            this.itineraryFlight.arrivalTime  = time;
        }, (error) => {
            console.log(error);
        });
    }

     private saveItinerary(): void {
         if (!this.createItineraries.form.valid)
             return;

        if (!this.hasFlightData()) {
            return;
        }

        this.getvalidDataTime();

        let dataModel = {
            id: this.itineraryFlight.id,
            userId: this.itineraryFlight.userId,

            itineraryType :this.itineraryFlight.itineraryType*1,
            reservationNumber: this.itineraryFlight.reservationNumber,
            departureCountry: this.itineraryFlight.departureCountry,
            departureCity: this.itineraryFlight.departureCity,
            departureAirport: this.itineraryFlight.departureAirport,
            departureDateTime: this.itineraryFlight.departureDate,

            arrivalCountry: this.itineraryFlight.arrivalCountry,
            arrivalCity: this.itineraryFlight.arrivalCity,
            arrivalAirport: this.itineraryFlight.arrivalAirport,
            arrivalDateTime: this.itineraryFlight.arrivalDate,
        };

        

        this.itinerariesService.saveItinerary(dataModel).subscribe((result) => {
        this.nav.pop();
        }, error => {
        });
    }

    private hasFlightData(): boolean {
        return this.itineraryFlight
            && this.itineraryFlight.reservationNumber
            && this.itineraryFlight.departureCountry
            && this.itineraryFlight.departureCity
            && this.itineraryFlight.departureDate
            && this.itineraryFlight.arrivalCountry
            && this.itineraryFlight.arrivalCity
            && this.itineraryFlight.arrivalDate;
    }

    private getvalidDataTime(): boolean {
        this.itineraryFlight.departureDate = moment(this.itineraryFlight.departureDate.format("YYYY-MM-DD") + ' ' + this.itineraryFlight.departureTime.format("hh:mm"));
        this.itineraryFlight.arrivalDate = moment(this.itineraryFlight.arrivalDate.format("YYYY-MM-DD") + ' ' + this.itineraryFlight.arrivalTime.format("hh:mm"));
        return true;
    }

    private addAnother(): void {
       let now = new Date();

       this.itineraryFlight = {
           departureDate : moment(now.toDateString()),
           arrivalDate: moment(now.toDateString()),
           departureTime: moment(now, "hh:mm"),
           arrivalTime: moment(now, "hh:mm"),
           userId : this.userId,
           departureAirport:'',
           arrivalAirport: ''
       };
       this.showType = false;
    }

    public countriesDepartureBlurTimeout: any = null;
    public countriesArrivalBlurTimeout: any = null;

    public onCountriesDepartureBlur(): void {
        this.countriesDepartureBlurTimeout = setTimeout(() => {
            this.countriesDepartureVisible = false;
        }, 300);
    }

    public onCountriesDepartureFocus(): void {
        if (this.countriesDepartureBlurTimeout) {
            clearTimeout(this.countriesDepartureBlurTimeout);
        }

        this.countriesDepartureVisible = true;
    }

    public onCountriesArrivalBlur(): void {
        this.countriesArrivalBlurTimeout = setTimeout(() => {
            this.countriesArrivalVisible = false;
        }, 300);
    }

    public onCountriesArrivalFocus(): void {
        if (this.countriesArrivalBlurTimeout) {
            clearTimeout(this.countriesArrivalBlurTimeout);
        }

        this.countriesArrivalVisible = true;
    }
}
