import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { CreateUserMutationResponse, CreateUserMutationVariables } from "../definitions";

export function useCreateUserdMutation(): UseMutationResult<
  CreateUserMutationResponse,
  Error,
  CreateUserMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<CreateUserMutationResponse, Error, CreateUserMutationVariables>({
    mutationFn: async (formData: CreateUserMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to create user");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
