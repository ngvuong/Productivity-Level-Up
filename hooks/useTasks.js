import useSWR from 'swr';

export default function useTasksByDate(userId, options) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/tasks/`, options);

  return {
    tasks: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setTasks: mutate,
  };
}
