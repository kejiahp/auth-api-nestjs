import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'SamePasswordValidator', async: false })
export class SamePasswordValidator implements ValidatorConstraintInterface {
  validate(
    password: any,
    args: ValidationArguments,
  ): boolean | Promise<boolean> {
    //@ts-ignore
    if (args.object.password === args.object.passwordConfirmation) {
      return true;
    }
  }
  defaultMessage?(args?: ValidationArguments): string {
    return 'password and passwordConfirmation password must be the same.';
  }
}
