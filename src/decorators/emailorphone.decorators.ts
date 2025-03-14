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
        validate(value: any, args: ValidationArguments) {
          // Handle undefined or null values
          if (value === undefined || value === null) {
            return false; // Fail validation if the field is missing
          }

          const isEmail = value.includes('@');
          const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(value); // E.164 format
          return isEmail || isPhoneNumber;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid email or phone number`;
        },
      },
    });
  };
}
