import useSWR from 'swr';
import { format } from 'date-fns';

export default function usePomodoros(userId, date, options) {
  if (!userId || !date) return { pomodoros: undefined };

  const targetDate = date === 'today' ? format(new Date(), 'yyyy-MM-dd') : date;

  const { data, error, mutate } = useSWR(
    `/api/user/${userId}/pomodoros/${targetDate}`,
    options
  );

  return {
    pomodoros: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setPomodoros: mutate,
  };
}
