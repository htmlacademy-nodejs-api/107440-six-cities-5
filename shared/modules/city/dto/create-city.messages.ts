export const CreateCityMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 4, max is 12'
  },
  latitude: {
    invalidFormat: 'latitude field has a wrong format'
  },
  longitude: {
    invalidFormat: 'longitude field has a wrong format'
  }
} as const;
