import InternalError from "@/components/errors/internal-error";
import type { DeleteUserMutationResponse, DeleteUserMutationVariables, UserWithoutPassword } from "@/lib/definitions";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import type { UseMutationResult } from "@tanstack/react-query";

export default function DeleteUserModal({
  isOpen,
  onOpenChange,
  user,
  mutation
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  user: UserWithoutPassword,
  mutation: UseMutationResult<DeleteUserMutationResponse, Error, DeleteUserMutationVariables>
}) {
  const deleteUser = async (onClose: () => void) => {
    mutation.mutate({
      id: Number(user.id)
    }, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        return <InternalError />
      }
    });
  }

  return (
    <Modal isOpen={isOpen} placement='auto' onOpenChange={onOpenChange} backdrop="blur" classNames={{base:"dark text-foreground"}} size="md">
      <ModalContent className="w-full max-w-md">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold items-center justify-center">Delete User</ModalHeader>
            <Divider />
            <ModalBody className="w-full mt-3 text-sm">
              <div className="flex flex-col gap-3">
                <p>Are you sure you want to delete this user?</p>
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-bold">User Details</h1>
                  <p>ID: {user.id}</p>
                  <p>Username: {user.username}</p>
                  <p>Role: {user.role}</p>
                  <h1 className="text-bold">Warning: </h1><p>This will also remove every record created by user</p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="w-full flex flex-row justify-end">
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={async () => deleteUser(onClose)}>
                Submit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
