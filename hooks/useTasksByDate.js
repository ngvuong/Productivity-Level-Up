import useSWR from 'swr';

export default function useTodayTasks(userId, date, options) {
  const { data, error, mutate } = useSWR(
    `/api/user/${userId}/tasks/${date}`,
    options
  );

  return {
    tasks: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setTasks: mutate,
  };
}
