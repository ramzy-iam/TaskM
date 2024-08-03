import { IsOptional } from 'class-validator';
import 'reflect-metadata';

interface OptionalFieldsOptions<T extends object> {
  excludeFields?: (keyof T)[];
}

const PROPERTIES_KEY = Symbol('properties');

export const TrackProperty = (target: Object, propertyKey: string | symbol) => {
  const existingProperties = Reflect.getMetadata(PROPERTIES_KEY, target) || [];
  Reflect.defineMetadata(
    PROPERTIES_KEY,
    [...existingProperties, propertyKey],
    target,
  );
};

export const MarkOptionalFields = <T extends object>(
  options: OptionalFieldsOptions<T> = {},
) => {
  return function (constructor: new () => T) {
    const instance = new constructor();
    const { excludeFields = [] } = options;

    const allFields = (Reflect.getMetadata(PROPERTIES_KEY, instance) ||
      []) as (keyof T)[];

    for (const key of allFields) {
      if (!excludeFields.includes(key)) {
        const metadata =
          Reflect.getMetadata(
            'class-validator:validation-decorators',
            constructor.prototype,
            key as string,
          ) || [];
        Reflect.decorate(
          [IsOptional(), ...metadata],
          constructor.prototype,
          key as string,
        );
        Reflect.defineMetadata(
          'design:type',
          Reflect.getMetadata(
            'design:type',
            constructor.prototype,
            key as string,
          ),
          constructor.prototype,
          key as string,
        );
      }
    }
  };
};
