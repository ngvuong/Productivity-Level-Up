import useSWR from 'swr';

export default function usePomodoros(userId, options) {
  const { data, error, mutate } = useSWR(
    `/api/user/${userId}/pomodoros`,
    options
  );

  return {
    pomodoros: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setPomodoros: mutate,
  };
}
