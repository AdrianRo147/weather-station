import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import type { DeleteUserMutationResponse, DeleteUserMutationVariables } from "../definitions";

export function useDeleteUserMutation() : UseMutationResult<
  DeleteUserMutationResponse,
  Error,
  DeleteUserMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserMutationResponse, Error, DeleteUserMutationVariables>({
    mutationFn: async (formData: DeleteUserMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to delete user");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  })
}
