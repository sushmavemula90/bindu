import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accommodation',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
})
export class AccommodationComponent implements OnInit {
  states: string[] = ['Rajasthan', 'Uttar Pradesh', 'Kerala', 'Maharashtra', 
    'Tamil Nadu', 'Karnataka', 'West Bengal', 'Gujarat', 
    'Punjab', 'Telangana', 'Odisha', 'Andhra Pradesh', 'Delhi'];
  selectedState: string = '';
  accommodationData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    place: '',
    accommodationType: '',
    priceRange: '',
    checkin: '',
    checkout: '',
    persons: 1,
    roomType: '',
    payment: '',
    additionalServices: [] as string[],
    specialNeeds: false,
    hotelName: '',
    hotelAddress: '',
    agentName: '',
    agentId: ''
  };
  

  locationPlacesMap: { [key: string]: string[] } = {
        'Rajasthan': ['Jaipur', 'Udaipur','Jaisalmer', 'Jodhpur'],
        'Uttar Pradesh': ['Agra', 'Varanasi', 'Lucknow', 'Mathura'],
        'Kerala': ['Alleppey', 'Munnar', 'Kochi', 'Varkala'],
        'Maharashtra': ['Mumbai', 'Pune', 'Aurangabad', 'Nashik'],
       'Tamil Nadu': ['Chennai', 'Madurai', 'Kanyakumari', 'Ooty'],
       'Karnataka': ['Bengaluru', 'Mysore', 'Hampi', 'Coorg'],
       'West Bengal': ['Kolkata', 'Darjeeling', 'Sundarbans', 'Shantiniketan'],
       'Gujarat': ['Ahmedabad', 'Kutch', 'Gir National Park','Somnath'],
       'Punjab': ['Amritsar', 'Chandigarh', 'Ludhiana', 'Patiala'],
       'Telangana': ['Hyderabad', 'Warangal', 'Ramoji Film City', 'Khammam'],
       'Odisha': ['Bhubaneswar', 'Puri', 'Konark', 'Ganjam'],
       'Andhra Pradesh': ['Visakhapatnam', 'Amaravati', 'Tirupati', 'Kadapa'],
       'Delhi': ['Red Fort', 'Qutub Minar', 'India Gate', 'Humayuns Tomb']
  };

  hotelData: {
     [key: string]: { 
          name: string;
          address: string;
          agentName:string;
          agentId:string;
         } } = {
    // Rajasthan
    Jaipur: { name: 'Jaipur Palace', address: 'Amber Fort Road, Jaipur' ,agentName:'John Doe',agentId:'AGT1001'},
    Udaipur: { name: 'Udaipur Lake View', address: 'Lake Pichola, Udaipur',agentName:'jane Smith',agentId:'AGT1002'},
    Jaisalmer: { name: 'Desert Haven', address: 'Sam Sand Dunes, Jaisalmer',agentName:'Emily Johnson',agentId:'AGT1003' },
    Jodhpur: { name: 'Jodhpur Heritage', address: 'Mehrangarh Fort Rd, Jodhpur',agentName:'Michael Brown',agentId:'AGT1004' },
    
    // Uttar Pradesh
    Agra: { name: 'Agra Grand', address: 'Taj Mahal East Gate, Agra' ,agentName:'Sarah Davis',agentId:'AGT1005'},
    Varanasi: { name: 'Varanasi Haveli', address: 'Ghats of Ganga, Varanasi',agentName:'William Garcia',agentId:'AGT1006' },
    Lucknow: { name: 'Nawab Residency', address: 'Hazratganj, Lucknow',agentName:'Jessica Martinez',agentId:'AGT1007' },
    Mathura: { name: 'Krishna Dham', address: 'Krishna Janmabhoomi, Mathura',agentName:'David Rodriguez',agentId:'AGT1008' },
    
    // Kerala
    Alleppey: { name: 'Alleppey Houseboat', address: 'Backwaters, Alleppey',agentName:'Mary Hernandez',agentId:'AGT1009' },
    Munnar: { name: 'Tea Valley Inn', address: 'Tea Gardens, Munnar',agentName:'James Wilson',agentId:'AGT1010' },
    Kochi: { name: 'Kochi Waterfront', address: 'Fort Kochi, Kochi' ,agentName:'Linda Anderson',agentId:'AGT1011'},
    Varkala: { name: 'Varkala Beachside', address: 'Cliff Road, Varkala',agentName:'Robert Taylor',agentId:'AGT1012' },
    
    // Maharashtra
    Mumbai: { name: 'Mumbai Stay', address: 'Juhu Beach, Mumbai',agentName:'Patricia Thomas',agentId:'AGT1013' },
    Pune: { name: 'Pune Plaza', address: 'FC Road, Pune',agentName:'Charles Moore',agentId:'AGT1014' },
    Aurangabad: { name: 'Aurangabad Residency', address: 'Ellora Caves Rd, Aurangabad',agentName:'Jennifier Jackson',agentId:'AGT1015' },
    Nashik: { name: 'Nashik Vineyard Retreat', address: 'Sula Vineyards, Nashik' ,agentName:'Thomas White',agentId:'AGT1016'},
    
    // Tamil Nadu
    Chennai: { name: 'Chennai Bay View', address: 'Marina Beach Rd, Chennai',agentName:'Susan Harris',agentId:'AGT1017' },
    Madurai: { name: 'Temple Inn', address: 'Meenakshi Temple Rd, Madurai',agentName:'Christopher Martin',agentId:'AGT1018' },
    Kanyakumari: { name: 'Cape View', address: 'Vivekananda Rock, Kanyakumari',agentName:'Barbara Thompson',agentId:'AGT1019' },
    Ooty: { name: 'Hilltop Retreat', address: 'Botanical Gardens, Ooty' ,agentName:'Daniel Garcia',agentId:'AGT1020'},
    
    // Karnataka
    Bengaluru: { name: 'Bangalore Residency', address: 'MG Road, Bengaluru',agentName:'Nancy Martinez',agentId:'AGT1021' },
    Mysore: { name: 'Mysore Comfort', address: 'Palace Road, Mysore',agentName:'Matthew Robinson',agentId:'AGT1022' },
    Hampi: { name: 'Hampi Heritage Stay', address: 'Virupaksha Temple Rd, Hampi',agentName:'Karen Clark',agentId:'AGT1023' },
    Coorg: { name: 'Coorg Hill Resort', address: 'Madikeri, Coorg' ,agentName:'Anthony Lewis',agentId:'AGT1024'},
    
    // West Bengal
    Kolkata: { name: 'Kolkata Heritage', address: 'Park Street, Kolkata',agentName:'Lisa lee',agentId:'AGT1025' },
    Darjeeling: { name: 'Darjeeling Hills', address: 'Tea Garden View, Darjeeling' ,agentName:'Mark Walker',agentId:'AGT1026'},
    Sundarbans: { name: 'Mangrove Retreat', address: 'Sundarbans National Park' ,agentName:'Helen Hall',agentId:'AGT1027'},
    Shantiniketan: { name: 'Tagore’s Abode', address: 'Visva Bharati Rd, Shantiniketan' ,agentName:'Joshua Allen ',agentId:'AGT1028'},
    
    // Gujarat
    Ahmedabad: { name: 'Ahmedabad Heritage', address: 'Sabarmati Ashram, Ahmedabad' ,agentName:'Deborah Young',agentId:'AGT1029'},
    Kutch: { name: 'White Rann Camp', address: 'Rann of Kutch, Kutch' ,agentName:'Paul King',agentId:'AGT1030'},
    Gir: { name: 'Lion’s Den', address: 'Gir National Park, Gujarat',agentName:'Sandra Wright',agentId:'AGT1031' },
    Somnath: { name: 'Somnath Seaside', address: 'Temple Rd, Somnath',agentName:'Andrew Scott',agentId:'AGT1032' },
    
    // Punjab
    Amritsar: { name: 'Golden Stay', address: 'Golden Temple Rd, Amritsar',agentName:'Rebecca Green',agentId:'AGT1033' },
    Chandigarh: { name: 'Chandigarh Garden View', address: 'Sector 17, Chandigarh' ,agentName:'Kevin Adams',agentId:'AGT1034'},
    Ludhiana: { name: 'Ludhiana Residency', address: 'Clock Tower Rd, Ludhiana',agentName:'Laura Baker',agentId:'AGT1035' },
    Patiala: { name: 'Royal Heritage', address: 'Qila Mubarak Rd, Patiala' ,agentName:'Brian Gonzalez',agentId:'AGT1036'},
    
    // Telangana
    Hyderabad: { name: 'Hyderabad Haveli', address: 'Charminar, Hyderabad' ,agentName:'Michelle Nelson',agentId:'AGT1037'},
    Warangal: { name: 'Kakatiya Inn', address: 'Fort Rd, Warangal' ,agentName:'Charles Carter',agentId:'AGT1038'},
    'Ramoji Film City': { name: 'Film City Stay', address: 'Ramoji Film City, Hyderabad' ,agentName:'Jessica Mitchell',agentId:'AGT1039'},
    Khammam: { name: 'Khammam Comfort', address: 'Lakaram Lake, Khammam' ,agentName:'Jason Perez',agentId:'AGT1040'},
    
    // Odisha
    Bhubaneswar: { name: 'Bhubaneswar Heritage', address: 'Lingaraj Temple Rd, Bhubaneswar' ,agentName:'Elizabeth Roberts',agentId:'AGT1041'},
    Puri: { name: 'Puri Beachside', address: 'Swargadwar Beach Rd, Puri' ,agentName:'Jonathan Turner',agentId:'AGT1042'},
    Konark: { name: 'Sun Temple Retreat', address: 'Sun Temple Rd, Konark',agentName:'Anna Phillips',agentId:'AGT1043' },
    Ganjam: { name: 'Ganjam Getaway', address: 'Chilika Lake, Ganjam',agentName:'Eric Campbell',agentId:'AGT1044' },
    
    // Andhra Pradesh
    Visakhapatnam: { name: 'Hotel Visakha', address: 'Beach Road, Visakhapatnam' ,agentName:'Megan Parker',agentId:'AGT1045'},
    Amaravati: { name: 'Capital Stay', address: 'Amaravati Stupa, Amaravati' ,agentName:'timothy Evans',agentId:'AGT1046'},
    Tirupati: { name: 'Temple Heights', address: 'Tirumala, Tirupati' ,agentName:'Sophia Edwards',agentId:'AGT1047'},
    Kadapa: { name: 'Kadapa Inn', address: 'Ameen Peer Dargah Rd, Kadapa' ,agentName:'Nathan Rivera',agentId:'AGT1048'},
    
    // Delhi
    'Red Fort': { name: 'Heritage Red', address: 'Lal Qila, Delhi',agentName:'Angela Cooper',agentId:'AGT1049' },
    'Qutub Minar': { name: 'Qutub Residency', address: 'Qutub Complex Rd, Delhi',agentName:'Justin Reyes',agentId:'AGT1050' },
    'India Gate': { name: 'Patriot’s Stay', address: 'India Gate Rd, Delhi' ,agentName:'Kelly Bailey',agentId:'AGT1051'},
    'Humayuns Tomb': { name: 'Mughal Residency', address: 'Nizamuddin, Delhi',agentName:'Ryan Murphy',agentId:'AGT1052' },
  };


  places: string[] = [];

  constructor(private http: HttpClient) {}
  ngOnInit() {
    // No need to call this.states() as it is an array
  }

  // Function to update places based on selected location
  updatePlaces() {
    this.places = this.locationPlacesMap[this.accommodationData.location] || [];
    this.accommodationData.hotelName = '';
    this.accommodationData.hotelAddress = '';
    this.accommodationData.agentName = '';
    this.accommodationData.agentId = '';
  }

  // Function to update hotel details based on selected place
  onPlaceChange() {
    const place = this.accommodationData.place as keyof typeof this.hotelData;
    const hotel = this.hotelData[place];
    if (hotel) {
      this.accommodationData.hotelName = hotel.name;
      this.accommodationData.hotelAddress = hotel.address;
      this.accommodationData.agentName = hotel.agentName;
      this.accommodationData.agentId = hotel.agentId;
    } else {
      this.accommodationData.hotelName = '';
      this.accommodationData.hotelAddress = '';
      this.accommodationData.agentName = '';
      this.accommodationData.agentId = '';
    }
  }

  // Function to update additional services based on checkbox selection
  updateAdditionalServices(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.accommodationData.additionalServices.push(value);
    } else {
      const index = this.accommodationData.additionalServices.indexOf(value);
      if (index > -1) {
        this.accommodationData.additionalServices.splice(index, 1);
      }
    }
  }
  
  // Sample submit function
  submitAccommodation() {
    const emailPattern = /^[a-z][a-z0-9]*\d+@gmail\.com$/;
    if (!emailPattern.test(this.accommodationData.email)) {
      alert("Email must start with letters, contain numbers, and end with '@gmail.com'.");
      return;
    }

    // Validate that both terms checkboxes are checked
  const terms1 = document.getElementById('terms1') as HTMLInputElement;
  const terms2 = document.getElementById('terms2') as HTMLInputElement;

  if (!terms1.checked || !terms2.checked) {
    alert("Please agree to both terms before submitting.");
    return;
  }
  
    const formData = this.accommodationData;
    this.http.post('http://localhost:5200/api/accommodation', formData)
      .subscribe({
        next: () => {
          alert('Accommodation data saved successfully!');
  
          // Reset the form by clearing each field in accommodationData
          this.accommodationData = {
            fullName: '',
            email: '',
            phone: '',
            address: '',
            location: '',
            place: '',
            accommodationType: '',
            priceRange: '',
            checkin: '',
            checkout: '',
            persons: 1,
            roomType: '',
            payment: '',
            additionalServices: [],
            specialNeeds: false,
            hotelName: '',
            hotelAddress: '',
            agentName: '',
            agentId: ''
          };
          this.places = [];
  
          // Manually reset each additional services checkbox
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"][id^="service"]'
          ) as NodeListOf<HTMLInputElement>;
          checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
          });
  
          // Reset terms and conditions checkboxes
          const terms1 = document.getElementById('terms1') as HTMLInputElement;
          const terms2 = document.getElementById('terms2') as HTMLInputElement;
          if (terms1) terms1.checked = false;
          if (terms2) terms2.checked = false;
  
        },
        error: (error) => alert(error.error.message || 'Error submitting data'),
      });
  }
  
}