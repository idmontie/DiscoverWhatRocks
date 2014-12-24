
/* global Migrations */
/* global PlaceTypes */

Migrations.add( 'add-place-types-to-database', function () {
  'use strict';

  var googlePlaceTypes = [
    {
      slug : 'accounting',
      readibleName : 'Accounting'
    },
    {
      slug : 'airport',
      readibleName : 'Airports'
    },
    {
      slug : 'amusement_park',
      readibleName : 'Amusement Parks'
    },
    {
      slug : 'aquarium',
      readibleName : 'Aquariums'
    },
    {
      slug : 'art_gallery',
      readibleName : 'Art Galleries'
    },
    {
      slug : 'atm',
      readibleName : 'A.T.M.s'
    },
    {
      slug : 'bakery',
      readibleName : 'Bakeries'
    },
    {
      slug : 'bank',
      readibleName : 'Banks'
    },
    {
      slug : 'bar',
      readibleName : 'Bars'
    },
    {
      slug : 'beauty_salon',
      readibleName : 'Beauty Salons'
    },
    {
      slug : 'bicycle_store',
      readibleName : 'Bicycle Stores'
    },
    {
      slug : 'book_store',
      readibleName : 'Book Stores'
    },
    {
      slug : 'bowling_alley',
      readibleName : 'Bowling Alleys'
    },
    {
      slug : 'bus_station',
      readibleName : 'Bus Stations'
    },
    {
      slug : 'cafe',
      readibleName : 'Cafes'
    },
    {
      slug : 'campground',
      readibleName : 'Campgrounds'
    },
    {
      slug : 'car_dealer',
      readibleName : 'Car Dealers'
    },
    {
      slug : 'car_rental',
      readibleName : 'Car Rentals'
    },
    {
      slug : 'car_repair',
      readibleName : 'Car Repairs'
    },
    {
      slug : 'car_wash',
      readibleName : 'Car Washes'
    },
    {
      slug : 'casino',
      readibleName : 'Casinos'
    },
    {
      slug : 'cemetery',
      readibleName : 'Cemeteries'
    },
    {
      slug : 'church',
      readibleName : 'Churches'
    },
    {
      slug : 'city_hall',
      readibleName : 'City Hall'
    },
    {
      slug : 'clothing_store',
      readibleName : 'Clothing Stores'
    },
    {
      slug : 'convenience_store',
      readibleName : 'Convenience Stores'
    },
    {
      slug : 'courthouse',
      readibleName : 'Courthouses'
    },
    {
      slug : 'dentist',
      readibleName : 'Dentists'
    },
    {
      slug : 'department_store',
      readibleName : 'Department Stores'
    },
    {
      slug : 'doctor',
      readibleName : 'Doctors'
    },
    {
      slug : 'electrician',
      readibleName : 'Electricians'
    },
    {
      slug : 'electronics_store',
      readibleName : 'Electronics Stores'
    },
    {
      slug : 'embassy',
      readibleName : 'Embassies'
    },
    {
      slug : 'establishment',
      readibleName : 'Establishments'
    },
    {
      slug : 'finance',
      readibleName : 'Finances'
    },
    {
      slug : 'fire_station',
      readibleName : 'Fire Stations'
    },
    {
      slug : 'florist',
      readibleName : 'Florists'
    },
    {
      slug : 'food',
      readibleName : 'Food'
    },
    {
      slug : 'funeral_home',
      readibleName : 'Funeral Homes'
    },
    {
      slug : 'furniture_store',
      readibleName : 'Furniture Stores'
    },
    {
      slug : 'gas_station',
      readibleName : 'Gas Stations'
    },
    {
      slug : 'general_contractor',
      readibleName : 'General Contractors'
    },
    {
      slug : 'grocery_or_supermarket',
      readibleName : 'Groceries/Supermarkets'
    },
    {
      slug : 'gym',
      readibleName : 'Gyms'
    },
    {
      slug : 'hair_care',
      readibleName : 'Hair Care'
    },
    {
      slug : 'hardware_store',
      readibleName : 'Hardware Stores'
    },
    {
      slug : 'health',
      readibleName : 'Health'
    },
    {
      slug : 'hindu_temple',
      readibleName : 'Hindu Temples'
    },
    {
      slug : 'home_goods_store',
      readibleName : 'Home Goods Stores'
    },
    {
      slug : 'hospital',
      readibleName : 'Hospitals'
    },
    {
      slug : 'insurance_agency',
      readibleName : 'Insurance Agencies'
    },
    {
      slug : 'jewelry_store',
      readibleName : 'Jewelry Stores'
    },
    {
      slug : 'laundry',
      readibleName : 'Laundry'
    },
    {
      slug : 'lawyer',
      readibleName : 'Lawyers'
    },
    {
      slug : 'library',
      readibleName : 'Libraries'
    },
    {
      slug : 'liquor_store',
      readibleName : 'Liquor Stores'
    },
    {
      slug : 'local_government_office',
      readibleName : 'Local Government Offices'
    },
    {
      slug : 'locksmith',
      readibleName : 'Locksmiths'
    },
    {
      slug : 'lodging',
      readibleName : 'Lodging'
    },
    {
      slug : 'meal_delivery',
      readibleName : 'Meal Deliveries'
    },
    {
      slug : 'meal_takeaway',
      readibleName : 'Meal Takeaway'
    },
    {
      slug : 'mosque',
      readibleName : 'Mosques'
    },
    {
      slug : 'movie_rental',
      readibleName : 'Movie Rental'
    },
    {
      slug : 'movie_theater',
      readibleName : 'Movie Theatres'
    },
    {
      slug : 'moving_company',
      readibleName : 'Moving Companies'
    },
    {
      slug : 'museum',
      readibleName : 'Museums'
    },
    {
      slug : 'night_club',
      readibleName : 'Night Clubs'
    },
    {
      slug : 'painter',
      readibleName : 'Painters'
    },
    {
      slug : 'park',
      readibleName : 'Parks'
    },
    {
      slug : 'parking',
      readibleName : 'Parking'
    },
    {
      slug : 'pet_store',
      readibleName : 'Pet Stores'
    },
    {
      slug : 'pharmacy',
      readibleName : 'Pharmacies'
    },
    {
      slug : 'physiotherapist',
      readibleName : 'Physiotherapists'
    },
    {
      slug : 'place_of_worship',
      readibleName : 'Places of Worship'
    },
    {
      slug : 'plumber',
      readibleName : 'Plumbers'
    },
    {
      slug : 'police',
      readibleName : 'Police'
    },
    {
      slug : 'post_office',
      readibleName : 'Post Offices'
    },
    {
      slug : 'real_estate_agency',
      readibleName : 'Real Estate Agencies'
    },
    {
      slug : 'restaurant',
      readibleName : 'Restaurants'
    },
    {
      slug : 'roofing_contractor',
      readibleName : 'Roofing Contractors'
    },
    {
      slug : 'rv_park',
      readibleName : 'RV Parks'
    },
    {
      slug : 'school',
      readibleName : 'Schools'
    },
    {
      slug : 'shoe_store',
      readibleName : 'Shoe Stores'
    },
    {
      slug : 'shopping_mall',
      readibleName : 'Shopping Malls'
    },
    {
      slug : 'spa',
      readibleName : 'Spas'
    },
    {
      slug : 'stadium',
      readibleName : 'Stadiums'
    },
    {
      slug : 'storage',
      readibleName : 'Storage'
    },
    {
      slug : 'store',
      readibleName : 'Stores'
    },
    {
      slug : 'subway_station',
      readibleName : 'Subway Stations'
    },
    {
      slug : 'synagogue',
      readibleName : 'Synagogues'
    },
    {
      slug : 'taxi_stand',
      readibleName : 'Taxi Stands'
    },
    {
      slug : 'train_station',
      readibleName : 'Train Stations'
    },
    {
      slug : 'travel_agency',
      readibleName : 'Travel Agencies'
    },
    {
      slug : 'university',
      readibleName : 'Universities'
    },
    {
      slug : 'veterinary_care',
      readibleName : 'Veterinary Care'
    },
    {
      slug : 'zoo',
      readibleName : 'Zoos'
    }
  ]

  for ( var i = 0; i < googlePlaceTypes.length; i++ ) {
    PlaceTypes.insert( googlePlaceTypes[i] )
  }

} );
