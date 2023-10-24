export const CreateRentOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100'
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024'
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date'
  },
  image: {
    invalidFormat: 'preview must be a string',
    maxLength: 'Too short for field «image»'
  },
  type: {
    invalid: 'type must be Apartment, House, Room or Hotel'
  },
  features: {
    invalidFormat: 'Field cities must be an array',
    invalid:
      'Feature must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels or Fridge'
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000'
  },
  premium: {
    invalidFormat: 'Field premium must be a boolean'
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: 'Minimum rooms is 1',
    maxValue: 'Maximum rooms is 8'
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: 'Minimum guests is 1',
    maxValue: 'Maximum guests is 10'
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5'
  },
  images: {
    invalidFormat: 'Field images must be an array'
  },
  cityId: {
    invalidId: 'cityId field must be a valid id'
  },
  userId: {
    invalidId: 'userId field must be a valid id'
  }
} as const;
