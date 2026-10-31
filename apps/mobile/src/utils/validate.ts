export type Field = {
  field: string;
  rules: {
    check: boolean;
    message: string;
  }[];
};

export function validate(fields: Field[]) {
  let error: any;

  fields.forEach(({field, rules}) => {
    for (let {check, message} of rules) {
      if (check) {
        if (!error) {
          error = {};
        }
        error[field] = message;
        break;
      }
    }
  });

  return error;
}

validate.isRequired = (value?: string) => value === undefined || value === '';

validate.isEmail = (value?: string) =>
  value !== undefined && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

validate.minLength = (minLength: number, value?: string) =>
  value !== undefined && value.length < minLength;

validate.maxLength = (maxLength: number, value: string) =>
  value === undefined || value.length > maxLength;

validate.isSample = (value?: string, reValue?: string) =>
  value === undefined || !reValue === undefined || value !== reValue;
