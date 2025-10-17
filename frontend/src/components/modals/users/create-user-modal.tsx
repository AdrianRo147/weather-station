import InternalError from "@/components/errors/internal-error";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/svg/eye-icons";
import type { CreateUserMutationResponse, CreateUserMutationVariables } from "@/lib/definitions";
import { Button, Divider, Form, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

export default function CreateUserModal({
  isOpen,
  onOpenChange,
  mutation
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  mutation: UseMutationResult<CreateUserMutationResponse, Error, CreateUserMutationVariables>
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const onSubmit = async (e: FormEvent<HTMLFormElement>, onClose: () => void) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    mutation.mutate({
      username: data.username.toString(),
      password: data.password.toString()
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
    <Modal isOpen={isOpen} placement='auto' onOpenChange={onOpenChange} backdrop='blur' classNames={{base:"dark text-foreground"}} size='md'>
      <ModalContent className="w-full max-w-md">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-2xl font-bold items-center justify-center">Create New Users</ModalHeader>
            <Divider />
            <Form onSubmit={(e) => onSubmit(e, onClose)} className="w-full mt-3">
              <ModalBody className="w-full">
                <Input
                  isRequired
                  errorMessage="Enter valid username"
                  label="Username"
                  labelPlacement="outside"
                  name="username"
                  placeholder="Enter username"
                  type="text"
                  classNames={{
                    base: "w-full",
                    input: "w-full"
                  }}
                />
                <Input
                  isRequired
                  errorMessage="Enter valid password"
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Enter password"
                  type={isPasswordVisible ? "text" : "password"}
                  classNames={{
                    base: "w-full",
                    input: "w-full"
                  }}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-solid outline-transparent"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
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
