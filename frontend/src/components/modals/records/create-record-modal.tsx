import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  Divider,
} from "@heroui/react";
import { type FormEvent } from "react";
import InternalError from "../../errors/internal-error";
import type { UseMutationResult } from "@tanstack/react-query";
import type { CreateRecordMutationResponse, CreateRecordMutationVariables } from "@/lib/definitions";

export default function CreateRecordModal({
  isOpen,
  onOpenChange,
  mutation
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  mutation: UseMutationResult<CreateRecordMutationResponse, Error, CreateRecordMutationVariables>
}) {
  const onSubmit = async (e: FormEvent<HTMLFormElement>, onClose: () => void) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    mutation.mutate({
      temperature: Number(data.temperature)
    }, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        return <InternalError />
      }
    })
  }

  return (
      <Modal isOpen={isOpen} placement='auto' onOpenChange={onOpenChange} backdrop="blur" classNames={{base:"dark text-foreground"}} size="md">
        <ModalContent className="w-full max-w-md">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-bold items-center justify-center">Create New Record</ModalHeader>
              <Divider />
              <Form onSubmit={(e) => onSubmit(e, onClose)} className="w-full mt-3">
                <ModalBody className="w-full">
                  <Input
                    isRequired
                    errorMessage="Enter valid temperature"
                    label="Temperature"
                    labelPlacement="outside"
                    name="temperature"
                    placeholder="Enter temperature"
                    type="number"
                    classNames={{
                      base: "w-full",
                      input: "w-full"
                    }}
                  />
                </ModalBody>
                <ModalFooter className="w-full flex flex-row justify-end">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" isLoading={mutation.isPending}>
                    Submit
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
