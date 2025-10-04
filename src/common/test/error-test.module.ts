import { Module } from '@nestjs/common';
import { ErrorTestController } from './error-test.controller';

@Module({
    controllers: [ErrorTestController],
})
export class ErrorTestModule { }
