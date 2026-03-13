import { useRef, useState } from 'react';
import { useLazyCheckUsernameQuery, useUpdateCurrentUserMutation } from '../api/endpoints/user';
import { FORM_FIELDS } from './types/form-fields';

export const useUserForm = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [checkUsername] = useLazyCheckUsernameQuery();
  const [updateCurrentUser, { isLoading }] = useUpdateCurrentUserMutation();

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FORM_FIELDS.map((f) => [f.id, ''])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUsername = async (username: string) => {
    if (!username) {
      setErrors((prev) => ({ ...prev, username: '' }));
      return;
    }
    const isTaken = await checkUsername(username).unwrap();
    setErrors((prev) => ({
      ...prev,
      username: isTaken ? 'Username is already taken' : '',
    }));
  };

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (id === 'username') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => validateUsername(value), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCurrentUser({
        username: values.username,
        displayName: values.displayname,
        country: values.country,
        city: values.city,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const isSubmitDisabled = !!errors.username || FORM_FIELDS.some((f) => !values[f.id]?.trim());

  return { values, errors, isSubmitDisabled, isLoading, handleChange, handleSubmit };
};
