import useSWR from 'swr';
import { format } from 'date-fns';

export default function useTasksByDate(userId, date, options) {
  const targetDate = date === 'today' ? format(new Date(), 'yyyy-MM-dd') : date;

  const { data, error, mutate } = useSWR(
    `/api/user/${userId}/tasks/${targetDate}`,
    options
  );

  return {
    tasks: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setTasks: mutate,
  };
}
