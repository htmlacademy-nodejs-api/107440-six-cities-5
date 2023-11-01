import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from '../shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from '../shared/modules/user/index.js';
import { createCityContainer } from '../shared/modules/city/index.js';
import { createRentOfferContainer } from '../shared/modules/rent-offer/index.js';
import { createCommentContainer } from '../shared/modules/comment/index.js';
import { createAuthContainer } from '../shared/modules/auth/index.js';
import { createFavoriteContainer } from '../shared/modules/favorite/favorite.container.js';

function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createRentOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer(),
    createAuthContainer()
  );

  const restApplication = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  restApplication.init();
}

bootstrap();
