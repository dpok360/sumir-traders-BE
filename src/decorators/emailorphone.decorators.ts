import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEmailOrPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailOrPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          // Ensure value is a string
          if (typeof value !== 'string') {
            return false;
          }

          const isEmail = value.includes('@');
          const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(value);
          return isEmail || isPhoneNumber;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid email or phone number`;
        },
      },
    });
  };
}
