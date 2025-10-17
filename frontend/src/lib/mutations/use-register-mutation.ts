import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { RegisterMutationResponse, RegisterMutationVariables } from "../definitions";

export function useRegisterMutation(): UseMutationResult<
  RegisterMutationResponse,
  Error,
  RegisterMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<RegisterMutationResponse, Error, RegisterMutationVariables>({
    mutationFn: async (formData: RegisterMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      return data.user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    }
  })
}
