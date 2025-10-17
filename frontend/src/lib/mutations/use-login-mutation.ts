import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { LoginMutationResponse, LoginMutationVariables } from '../definitions';

export function useLoginMutation(): UseMutationResult<
  LoginMutationResponse,
  Error,
  LoginMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<LoginMutationResponse, Error, LoginMutationVariables>({
    mutationFn: async (formData: LoginMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
}
