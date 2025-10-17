import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import InternalError from "../../errors/internal-error";
import type { UseMutationResult } from "@tanstack/react-query";
import type { DeleteRecordMutationResponse, DeleteRecordMutationVariables } from "@/lib/definitions";
import type { Record } from "@/lib/definitions";

export default function DeleteRecordModal({
  isOpen,
  onOpenChange,
  record,
  mutation
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  record: Record,
  mutation: UseMutationResult<DeleteRecordMutationResponse, Error, DeleteRecordMutationVariables>

}) {
  const deleteRecord = async (onClose: () => void) => {
    mutation.mutate({
      id: Number(record.id)
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
              <ModalHeader className="flex flex-col gap-1 text-2xl font-bold items-center justify-center">Delete Record</ModalHeader>
              <Divider />
              <ModalBody className="w-full mt-3 text-sm">
                <div className="flex flex-col gap-3">
                  <p>Are you sure you want to delete this record?</p>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-bold">Record Details</h1>
                    <p>ID: {record.id}</p>
                    <p>temperature: {record.temperature}</p>
                    <p>Created At: {new Date(record.uploaded_at).toLocaleString()}</p>
                    <p>Created By: {record.username}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="w-full flex flex-row justify-end">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={async () => deleteRecord(onClose)}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
