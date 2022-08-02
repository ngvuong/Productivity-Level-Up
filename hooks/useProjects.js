import useSWR from 'swr';

export default function useProjects(userId, options) {
  const { data, error, mutate } = useSWR(
    `/api/user/${userId}/projects`,
    options
  );

  return {
    projects: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setProjects: mutate,
  };
}
