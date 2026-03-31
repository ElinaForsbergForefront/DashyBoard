import { useRef, useState } from 'react';
import { useUpdateCurrentUserMutation } from '../api/endpoints/user';
import { useLocationFields } from './useLocationFields';
import { useUsernameValidation } from './useUsernameValidation';
import { FORM_FIELDS } from './types/form-fields';

export const useUserForm = () => {
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();

  const submitLockRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FORM_FIELDS.map((f) => [f.id, ''])),
  );

  const { usernameError, scheduleValidation } = useUsernameValidation();
  const { countryOptions, cityOptions, selectedCountryCode, isCountriesLoading, isCitiesFetching, cityError } =
    useLocationFields(values.country, values.city);

  const handleChange = (id: string, value: string) => {
    if (id === 'country') {
      setValues((prev) => ({ ...prev, country: value, city: '' }));
      return;
    }
    setValues((prev) => ({ ...prev, [id]: value }));
    if (id === 'username') scheduleValidation(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    try {
      await updateCurrentUser({
        username: values.username,
        displayName: values.displayName,
        country: values.country,
        city: values.city,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update user', err);
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const errors: Record<string, string> = { username: usernameError, city: cityError };
  const isSubmitDisabled =
    !!usernameError ||
    !!cityError ||
    isCitiesFetching ||
    isSubmitting ||
    FORM_FIELDS.some((f) => !values[f.id]?.trim());

  const cityDisabled = !selectedCountryCode;

  const fieldExtras: Record<string, {
    options?: { value: string; label: string }[];
    disabled?: boolean;
    helperText?: string;
    listId?: string;
  }> = {
    country: {
      options: countryOptions,
      disabled: isCountriesLoading,
      helperText: isCountriesLoading ? 'Loading countries...' : undefined,
    },
    city: {
      options: cityOptions,
      disabled: cityDisabled,
      listId: 'city-suggestions',
      helperText: cityDisabled
        ? 'Select a country before searching for a city'
        : isCitiesFetching
          ? 'Searching cities...'
          : 'Start typing to search within the selected country',
    },
  };

  return { values, errors, isSubmitDisabled, isLoading, fieldExtras, handleChange, handleSubmit };
};
