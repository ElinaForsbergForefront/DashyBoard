import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllUsernames, updateUserMe } from '../../../api/users';
import { FORM_FIELDS } from './form-fields';

export const useUserForm = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FORM_FIELDS.map((f) => [f.id, '']))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkUsername = async (username: string) => {
    if (!username) {
      setErrors((prev) => ({ ...prev, username: '' }));
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      const usernames = await getAllUsernames(token);
      const taken = usernames.some((u) => u.toLowerCase() === username.toLowerCase());
      setErrors((prev) => ({
        ...prev,
        username: taken ? 'Username is already taken' : '',
      }));
    } catch (err) {
      console.error('Failed to check username', err);
    }
  };

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (id === 'username') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => checkUsername(value), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      await updateUserMe(token, {
        username: values.username,
        displayName: values.displayname,
        country: values.country,
        city: values.city,
      });
      window.dispatchEvent(new Event('profile-completed'));
      navigate('/');
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const isSubmitDisabled =
    !!errors.username || FORM_FIELDS.some((f) => !values[f.id]?.trim());

  return { values, errors, isSubmitDisabled, handleChange, handleSubmit };
};
