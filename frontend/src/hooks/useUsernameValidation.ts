import { useCallback, useRef, useState } from 'react';
import { useLazyCheckUsernameQuery } from '../api/endpoints/user';

export const useUsernameValidation = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [checkUsername] = useLazyCheckUsernameQuery();
  const [usernameError, setUsernameError] = useState('');

  const validate = useCallback(
    async (username: string) => {
      if (!username) { setUsernameError(''); return; }
      const isTaken = await checkUsername(username).unwrap();
      setUsernameError(isTaken ? 'Username is already taken' : '');
    },
    [checkUsername],
  );

  const scheduleValidation = useCallback(
    (username: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => validate(username), 300);
    },
    [validate],
  );

  return { usernameError, scheduleValidation };
};
