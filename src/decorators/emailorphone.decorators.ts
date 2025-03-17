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
          if (typeof value !== 'string') {
            return false;
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isEmail = emailRegex.test(value);

          const phoneRegex = /^\+9779\d{8}$/;
          const isPhoneNumber = phoneRegex.test(value);

          return isEmail || isPhoneNumber;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a valid email or phone number`;
        },
      },
    });
  };
}
