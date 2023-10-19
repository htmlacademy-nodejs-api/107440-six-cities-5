import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { CityService } from './city.service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { CityRdo } from './rdo/city.rdo.js';

@injectable()
export class CityController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService)
    private readonly cityService: CityService
  ) {
    super(logger);

    this.logger.info('Register routes for CityController');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const cities = await this.cityService.find();
    const responseData = fillDTO(CityRdo, cities);
    this.ok(res, responseData);
  }

  public create(_req: Request, _res: Response): void {
    // Код обработчика
  }
}
