import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { UpdateRecordMutationResponse, UpdateRecordMutationVariables } from '../definitions';

export function useUpdateRecordMutation(): UseMutationResult<
  UpdateRecordMutationResponse,
  Error,
  UpdateRecordMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<UpdateRecordMutationResponse, Error, UpdateRecordMutationVariables>({
    mutationFn: async (formData: UpdateRecordMutationVariables) => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/records`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update record");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}
