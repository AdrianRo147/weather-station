import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { UpdateUserMutationResponse, UpdateUserMutationVariables } from "../definitions";

export function useUpdateUserMutation() : UseMutationResult<
  UpdateUserMutationResponse,
  Error,
  UpdateUserMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserMutationResponse, Error, UpdateUserMutationVariables>({
    mutationFn: async (formData: UpdateUserMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to update user");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })
}
