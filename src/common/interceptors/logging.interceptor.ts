import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import logger from '../../config/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, query, params } = request;
        const userAgent = request.get('user-agent') || '';
        const ip = request.ip;

        const now = Date.now();
        const timestamp = new Date().toISOString();

        logger.info('Incoming request', {
            timestamp,
            method,
            url,
            body: this.sanitizeData(body),
            query,
            params,
            userAgent,
            ip,
        });

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const response = context.switchToHttp().getResponse();
                    const { statusCode } = response;
                    const responseTime = Date.now() - now;

                    logger.info('Outgoing response', {
                        timestamp: new Date().toISOString(),
                        method,
                        url,
                        statusCode,
                        responseTime: `${responseTime}ms`,
                    });
                },
                error: (error) => {
                    const responseTime = Date.now() - now;

                    logger.error('Request failed', {
                        timestamp: new Date().toISOString(),
                        method,
                        url,
                        error: error.message,
                        responseTime: `${responseTime}ms`,
                    });
                },
            }),
        );
    }

    private sanitizeData(data: any): any {
        if (!data) return data;

        const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization'];
        const sanitized = { ...data };

        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }
}
