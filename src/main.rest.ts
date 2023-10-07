import PinoLogger from '../shared/libs/logger/pino.logger.js';
import { RestApplication } from './rest/index.js';
import { RestConfig } from '../shared/libs/config/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);

  const restApplication = new RestApplication(logger, config);

  restApplication.init();
}

bootstrap();
