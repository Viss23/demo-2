import express, { Express } from "express";
import { Server } from "http";
import { inject, injectable } from "inversify";
import { ExceptionFilter } from "./errors/exception.filter.js";
import { ILogger } from "./logger/logger.interface.js";
import { TYPES } from "./types.js";
import { UserController } from "./users/users.controller.js";
import "reflect-metadata";

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.UserController) private userController: UserController,
    @inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter
  ) {
    this.app = express();
    this.port = 8000;
  }

  userRoutes() {
    this.app.use("/users", this.userController.router);
  }

  useExceptionsFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.userRoutes();
    this.useExceptionsFilters();
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Server http://localhost:${this.port}`);
    });
  }
}
