import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassContainer {
  new(...args: any[]): {};
}

export function Serializer(dto: ClassContainer) {
  return UseInterceptors(new SerializerInterceptor(dto));
}
export class SerializerInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) { }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((responsePayload: any) => {
        const { message, data, ...rest } = responsePayload || {};

        let result = data;

        // Scenario 1: data is an object containing arrays and metadata (e.g. { products: [], totalCount: 10 })
        // Serialize the data using the provided DTO
        if (Array.isArray(data)) {
          result = plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        } else if (data && typeof data === 'object' && ('products' in data || 'reviews' in data) && (Array.isArray((data as any).products) || Array.isArray((data as any).reviews))) {
          // Serialize the whole data object as the DTO so that nested @Type decorators
          // (e.g. @Type(() => Product) on a wishlist entity) are applied correctly.
          // Fall back to serializing products individually with the DTO if the DTO
          // doesn't have its own 'products' field (e.g. product controller returning paginated results).
          const dtoInstance = plainToInstance(this.dto, data, { excludeExtraneousValues: true });
          const hasOwnArray = (Array.isArray((dtoInstance as any)?.products) && (dtoInstance as any).products.length > 0) || 
                             (Array.isArray((dtoInstance as any)?.reviews) && (dtoInstance as any).reviews.length > 0);
          if (hasOwnArray) {
            result = dtoInstance;
          } else {
            result = {
              ...data,
              products: data.products ? plainToInstance(this.dto, data.products, { excludeExtraneousValues: true }) : undefined,
              reviews: data.reviews ? plainToInstance(this.dto, data.reviews, { excludeExtraneousValues: true }) : undefined
            };
          }
        } else if (data && typeof data === 'object' && 'results' in data) {
          result = {
            ...data,
            results: plainToInstance(this.dto, data.results, { excludeExtraneousValues: true })
          };
        } else {
          result = plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          });
        }

        return { message, data: result, ...rest };
      })
    );
  }
}
