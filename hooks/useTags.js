import useSWR from 'swr';

export default function useTags(userId, options) {
  const { data, error, mutate } = useSWR(`/api/user/${userId}/tags`, options);

  return {
    tags: data,
    isError: error || data?.error,
    isLoading: !error && !data,
    setTags: mutate,
  };
}
