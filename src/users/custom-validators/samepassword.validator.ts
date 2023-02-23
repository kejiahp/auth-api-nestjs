import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'SamePasswordValidator', async: false })
export class SamePasswordValidator implements ValidatorConstraintInterface {
  validate(
    password: any,
    args?: ValidationArguments,
  ): boolean | Promise<boolean> {
    //@ts-ignore
    return password === args.object.passwordConfirmation;
  }
  defaultMessage?(args?: ValidationArguments): string {
    return 'password and confirmation password must be the same.';
  }
}
