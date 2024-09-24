import { string, object, array } from 'yup';

export const defaultValidation = (name: string) => string().required(`${name} is required`);

export const protagonistSchema = object().shape({
    protagonists: array().of(
      object().shape({
        name: defaultValidation('Name'),
        age: defaultValidation('Age')
      })
    ),
  });
  