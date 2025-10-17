import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { CreateRecordMutationResponse, CreateRecordMutationVariables, UserQuery } from '../definitions';
import { useUser } from './use-user';

export function useCreateRecordMutation(): UseMutationResult<
  CreateRecordMutationResponse,
  Error,
  CreateRecordMutationVariables,
  unknown
> {
  const queryClient = useQueryClient();
  const user: UserQuery = useUser();

  return useMutation<CreateRecordMutationResponse, Error, CreateRecordMutationVariables>({
    mutationFn: async (formData: CreateRecordMutationVariables) => {
      if (!user.data) throw new Error();
      formData.uploaded_by = user.data.id;

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create record");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}
