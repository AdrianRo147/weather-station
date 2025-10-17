import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { DeleteRecordMutationResponse, DeleteRecordMutationVariables } from '../definitions';

export function useDeleteRecordMutation(): UseMutationResult<
  DeleteRecordMutationResponse,
  Error,
  DeleteRecordMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<DeleteRecordMutationResponse, Error, DeleteRecordMutationVariables>({
    mutationFn: async (formData: DeleteRecordMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/records`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to delete record");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}
