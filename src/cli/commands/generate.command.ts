import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../../shared/types/mock-server-data.type.js';
import { TSVOfferGenerator } from '../../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../../shared/helpers/index.js';
import { TSVFileWriter } from '../../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async loadData(url: string): Promise<void> {
    try {
      this.initialData = await got.get(url).json();
    } catch (e) {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async writeToFile(
    filepath: string,
    offerCount: number
  ): Promise<void> {
    const tsvGenerator = new TSVOfferGenerator(this.initialData);

    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvGenerator.generate());
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10) || 1;

    try {
      await this.loadData(url);
      await this.writeToFile(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error("Can't generate data");
      console.error(getErrorMessage(error));
    }
  }
}
