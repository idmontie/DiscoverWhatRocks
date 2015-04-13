// ============
// Lint Globals
// ============
/* global Migrations */
/* global PlaceTypes */

// ==========
// Migrations
// ==========
Migrations.add( 'update-place-types', function () {
  var googlePlaceTypes = [
    {
      slug : 'accounting',
      popular : false

    },
    {
      slug : 'airport',
      popular : false
    },
    {
      slug : 'amusement_park',
      popular : true
    },
    {
      slug : 'aquarium',
      popular : false
    },
    {
      slug : 'art_gallery',
      popular : false
    },
    {
      slug : 'atm',
      popular : false
    },
    {
      slug : 'bakery',
      popular : true
    },
    {
      slug : 'bank',
      popular : false
    },
    {
      slug : 'bar',
      popular : true
    },
    {
      slug : 'beauty_salon',
      popular : false
    },
    {
      slug : 'bicycle_store',
      popular : false
    },
    {
      slug : 'book_store',
      popular : true
    },
    {
      slug : 'bowling_alley',
      popular : false
    },
    {
      slug : 'bus_station',
      popular : false
    },
    {
      slug : 'cafe',
      popular : true
    },
    {
      slug : 'campground',
      popular : false
    },
    {
      slug : 'car_dealer',
      popular : false
    },
    {
      slug : 'car_rental',
      popular : false
    },
    {
      slug : 'car_repair',
      popular : false
    },
    {
      slug : 'car_wash',
      popular : false
    },
    {
      slug : 'casino',
      popular : false
    },
    {
      slug : 'cemetery',
      popular : false
    },
    {
      slug : 'church',
      popular : false
    },
    {
      slug : 'city_hall',
      popular : false
    },
    {
      slug : 'clothing_store',
      popular : true
    },
    {
      slug : 'convenience_store',
      popular : true
    },
    {
      slug : 'courthouse',
      popular : false
    },
    {
      slug : 'dentist',
      popular : false
    },
    {
      slug : 'department_store',
      popular : true
    },
    {
      slug : 'doctor',
      popular : false
    },
    {
      slug : 'electrician',
      popular : false
    },
    {
      slug : 'electronics_store',
      popular : true
    },
    {
      slug : 'embassy',
      popular : false
    },
    {
      slug : 'establishment',
      popular : false
    },
    {
      slug : 'finance',
      popular : false
    },
    {
      slug : 'fire_station',
      popular : false
    },
    {
      slug : 'florist',
      popular : false
    },
    {
      slug : 'food',
      popular : true
    },
    {
      slug : 'funeral_home',
      popular : false
    },
    {
      slug : 'furniture_store',
      popular : false
    },
    {
      slug : 'gas_station',
      popular : false
    },
    {
      slug : 'general_contractor',
      popular : false
    },
    {
      slug : 'grocery_or_supermarket',
      popular : true
    },
    {
      slug : 'gym',
      popular : true
    },
    {
      slug : 'hair_care',
      popular : false
    },
    {
      slug : 'hardware_store',
      popular : false
    },
    {
      slug : 'health',
      popular : false
    },
    {
      slug : 'hindu_temple',
      popular : false
    },
    {
      slug : 'home_goods_store',
      popular : false
    },
    {
      slug : 'hospital',
      popular : false
    },
    {
      slug : 'insurance_agency',
      popular : false
    },
    {
      slug : 'jewelry_store',
      popular : false
    },
    {
      slug : 'laundry',
      popular : false
    },
    {
      slug : 'lawyer',
      popular : false
    },
    {
      slug : 'library',
      popular : false
    },
    {
      slug : 'liquor_store',
      popular : false
    },
    {
      slug : 'local_government_office',
      popular : false
    },
    {
      slug : 'locksmith',
      popular : false
    },
    {
      slug : 'lodging',
      popular : false
    },
    {
      slug : 'meal_delivery',
      popular : false
    },
    {
      slug : 'meal_takeaway',
      popular : false
    },
    {
      slug : 'mosque',
      popular : false
    },
    {
      slug : 'movie_rental',
      popular : false
    },
    {
      slug : 'movie_theater',
      popular : true
    },
    {
      slug : 'moving_company',
      popular : false
    },
    {
      slug : 'museum',
      popular : true
    },
    {
      slug : 'night_club',
      popular : true
    },
    {
      slug : 'painter',
      popular : false
    },
    {
      slug : 'park',
      popular : true
    },
    {
      slug : 'parking',
      popular : false
    },
    {
      slug : 'pet_store',
      popular : false
    },
    {
      slug : 'pharmacy',
      popular : false
    },
    {
      slug : 'physiotherapist',
      popular : false
    },
    {
      slug : 'place_of_worship',
      popular : false
    },
    {
      slug : 'plumber',
      popular : false
    },
    {
      slug : 'police',
      popular : false
    },
    {
      slug : 'post_office',
      popular : false
    },
    {
      slug : 'real_estate_agency',
      popular : false
    },
    {
      slug : 'restaurant',
      popular : true
    },
    {
      slug : 'roofing_contractor',
      popular : false
    },
    {
      slug : 'rv_park',
      popular : false
    },
    {
      slug : 'school',
      popular : false
    },
    {
      slug : 'shoe_store',
      popular : false
    },
    {
      slug : 'shopping_mall',
      popular : true
    },
    {
      slug : 'spa',
      popular : true
    },
    {
      slug : 'stadium',
      popular : false
    },
    {
      slug : 'storage',
      popular : false
    },
    {
      slug : 'store',
      popular : true
    },
    {
      slug : 'subway_station',
      popular : false
    },
    {
      slug : 'synagogue',
      popular : false
    },
    {
      slug : 'taxi_stand',
      popular : false
    },
    {
      slug : 'train_station',
      popular : false
    },
    {
      slug : 'travel_agency',
      popular : false
    },
    {
      slug : 'university',
      popular : false
    },
    {
      slug : 'veterinary_care',
      popular : false
    },
    {
      slug : 'zoo',
      popular : false
    }
  ]

  for ( var i = 0; i < googlePlaceTypes.length; i++ ) {
    PlaceTypes.upsert( {
      slug: googlePlaceTypes[i].slug
    }, { 
      $set : {
        popular : googlePlaceTypes[i].popular
      }
    } )
  }


}, 20 );