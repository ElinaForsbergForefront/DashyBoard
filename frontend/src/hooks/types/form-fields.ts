export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
}

export const FORM_FIELDS: FormField[] = [
  { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter your username' },
  { id: 'displayname', label: 'Displayname', type: 'text', placeholder: 'Enter your displayname' },
  { id: 'country', label: 'Country', type: 'text', placeholder: 'Enter your country' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'Enter your city' },
];
