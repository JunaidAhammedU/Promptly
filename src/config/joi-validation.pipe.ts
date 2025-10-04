import { PipeTransform, Injectable } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ValidationException } from '../common/exceptions/http.exceptions';
import { ErrorDetails } from '../common/interfaces/error-response.interface';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) { }

    transform(value: any) {
        const { error } = this.schema.validate(value, { abortEarly: false });
        if (error) {
            const details: ErrorDetails[] = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context?.value,
            }));

            throw new ValidationException('Validation failed', details);
        }
        return value;
    }
}
