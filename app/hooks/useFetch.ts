import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export function useGet<T = any>(key: string, url: string) {
  return useQuery<T, Error>({
    queryKey: [key, url],
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
  });
}

export default useGet;
