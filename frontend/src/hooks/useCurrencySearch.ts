import { useRef, useState } from 'react';
import { useLazySearchCurrenciesQuery } from '../api/endpoints/currency';
import type { CurrencySearchQuoteDto } from '../api/types/currency';

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export const useCurrencySearch = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchCurrencies, { isFetching }] = useLazySearchCurrenciesQuery();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CurrencySearchQuoteDto[]>([]);

  const handleSearchChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < MIN_QUERY_LENGTH) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const response = await searchCurrencies(value).unwrap();
      setResults(response.quotes);
    }, DEBOUNCE_MS);
  };

  return { query, results, isSearching: isFetching, handleSearchChange };
};
