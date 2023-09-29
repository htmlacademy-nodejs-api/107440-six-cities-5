import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
        ${chalk.blue('Программа для подготовки данных для REST API сервера.')}
        ${chalk.blue('Пример')}:
            cli.js ${chalk.red('--<command>')} [${chalk.green('--arguments')}]
        ${chalk.blue('Команды')}:
            ${chalk.red('--version')}:                   # выводит номер версии
            ${chalk.red('--help')}:                      # печатает этот текст
            ${chalk.red('--import')} ${chalk.green(
              '<path>'
            )}:             # импортирует данные из TSV
            ${chalk.red('--generate')} ${chalk.green(
              '<n> <path> <url>'
            )}: # генерирует произвольное количество тестовых данных
    `);
  }
}
