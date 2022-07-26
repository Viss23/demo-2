import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { json } from 'body-parser';
import 'reflect-metadata';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './users/users.controller.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { UserController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.port = 8000;
	}

	userMiddleware(): void {
		this.app.use(json());
	}

	userRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionsFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.userMiddleware();
		this.userRoutes();
		this.useExceptionsFilters();
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server http://localhost:${this.port}`);
		});
	}
}
