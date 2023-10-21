export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  CityService: Symbol.for('CityService'),
  CityModel: Symbol.for('CityModel'),
  RentOfferService: Symbol.for('RentOfferService'),
  RentOfferModel: Symbol.for('RentOfferModel'),
  CommentService: Symbol.for('CommentService'),
  CommentModel: Symbol.for('CommentModel'),
  CityController: Symbol.for('CityController'),
  ExceptionFilter: Symbol.for('ExceptionFilter'),
  UserController: Symbol.for('UserController'),
  RentOfferController: Symbol.for('RentOfferController')
} as const;
