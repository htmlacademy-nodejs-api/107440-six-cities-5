import PinoLogger from '../shared/libs/logger/pino.logger.js';
import { RestApplication } from './rest/index.js';

function bootstrap() {
  const logger = new PinoLogger();
  const restApplication = new RestApplication(logger);

  restApplication.init();
}

bootstrap();
