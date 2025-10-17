import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient();

  fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, { credentials: "include" });
  queryClient.invalidateQueries({ queryKey: ["user"] });
  return <Navigate to='/login' />
}
