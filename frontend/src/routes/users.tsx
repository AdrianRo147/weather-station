import InternalError from '@/components/errors/internal-error'
import CreateUserModal from '@/components/modals/users/create-user-modal';
import DeleteUserModal from '@/components/modals/users/delete-user-modal';
import UpdateUserModal from '@/components/modals/users/update-user-modal';
import type { UserQuery, UserTableColumn, UserWithoutPassword } from '@/lib/definitions';
import { useCreateUserdMutation } from '@/lib/mutations/use-create-user-mutation';
import { useDeleteUserMutation } from '@/lib/mutations/use-delete-user-mutation';
import { useUpdateUserMutation } from '@/lib/mutations/use-update-user-mutation';
import { useUser } from '@/lib/mutations/use-user';
import { Button, Pagination, Tooltip, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { DeleteIcon } from '@/components/svg/delete-icon';
import { EditIcon } from '@/components/svg/edit-icon';
import { useCallback, useState, type Key } from 'react'

export const Route = createFileRoute('/users')({
  component: RouteComponent,
  errorComponent: InternalError
})

function RouteComponent() {
  const [page, setPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(null);

  const createUserModalDisclosure = useDisclosure();
  const updateUserModalDisclosure = useDisclosure();
  const deleteUserModalDisclosure = useDisclosure();

  const createUserMutation = useCreateUserdMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const rowsPerPage = 10;

  const fetchUsers = async (page: number) => {
    const offset = (page - 1) * rowsPerPage;

    const [usersRes, countRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/users?limit=${rowsPerPage}&offset=${offset}`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/users/count`)
    ]);

    if (!usersRes.ok || !countRes.ok) throw new Error();

    const usersData = await usersRes.json();
    const countData = await countRes.json();

    return {
      users: usersData.data,
      totalCount: countData.count
    };
  };

  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page)
  });

  const loggedUser: UserQuery = useUser();

  const totalCount = data?.totalCount ?? 0;
  const pages = Math.ceil(totalCount / rowsPerPage) || 1;

  const renderCell = useCallback((user: UserWithoutPassword, columnKey: Key) => {
    const cellValue = user[columnKey as keyof UserWithoutPassword];

    switch (columnKey) {
      case "id":
        return <p>{String(user.id)}</p>;
      case "username":
        return <p>{user.username}</p>;
      case "role":
        return <p>{user.role.toUpperCase()}</p>
      case "actions":
        if (loggedUser.data?.role === 'admin') {
          return (
            <div className="relative flex items-center gap-2 justify-center">
              <Tooltip content="Edit user">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedUser(user);
                    updateUserModalDisclosure.onOpen();
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedUser(user);
                    deleteUserModalDisclosure.onOpen();
                  }}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          )
        }
        else return;
      default:
        return String(cellValue ?? "");
    }
  }, [updateUserModalDisclosure, deleteUserModalDisclosure]);

  if (
    isError ||
    loggedUser.isError ||
    createUserMutation.isError ||
    updateUserMutation.isError ||
    deleteUserMutation.isError
  ) return <InternalError />;

  return (
    <>
      <div className="p-5 mb-5 rounded-xl bg-content1 font-bold text-2xl flex flex-row justify-between">
        <p className="font-bold text-2xl">Users</p>
        {loggedUser?.data?.role === 'admin' &&
          <Button
            variant="solid"
            color="primary"
            onPress={createUserModalDisclosure.onOpen}
          >
            Create New User
          </Button>
        }
      </div>

      <Table
        className="flex flex-1 items-center mx-auto"
        bottomContent={
          <div className="flex w-full justify-center">
            {!isLoading && !loggedUser.isLoading && (
              <Pagination
                key={`pagination-${page}-${totalCount}`}
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(_page) => setPage(_page)}
              />
            )}
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => {
            return (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.uid === "actions" && loggedUser?.data?.role !== "admin" ? "" : column.name}
              </TableColumn>
            )}
          }
        </TableHeader>

        <TableBody
          items={isLoading || loggedUser.isLoading || !data ? [] : data?.users}
          emptyContent={"No users found."}
          isLoading={isLoading || loggedUser.isLoading || !data}
          loadingContent={<LoadingComp />}
        >
          {(item: UserWithoutPassword) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loggedUser?.data?.role === "admin"
        ? (
          <CreateUserModal
            isOpen={createUserModalDisclosure.isOpen}
            onOpenChange={createUserModalDisclosure.onOpenChange}
            mutation={createUserMutation}
          />
        ) : null
      }

      {selectedUser && loggedUser?.data?.role === "admin" && (
        <>
          <UpdateUserModal
            isOpen={updateUserModalDisclosure.isOpen}
            onOpenChange={updateUserModalDisclosure.onOpenChange}
            userId={selectedUser.id}
            username={selectedUser.username}
            mutation={updateUserMutation}
          />

          <DeleteUserModal
            isOpen={deleteUserModalDisclosure.isOpen}
            onOpenChange={deleteUserModalDisclosure.onOpenChange}
            user={selectedUser}
            mutation={deleteUserMutation}
          />
        </>
      )}
    </>
  )
}

function LoadingComp() {
  return (
    <div className='flex flex-col items-center justify-center my-auto'>
      <Spinner classNames={{label: "text-foreground/80 mt-4"}} label='Loading Records' variant='simple' />
    </div>
  );

}

const columns: Array<UserTableColumn> = [
  { name: 'ID', uid: 'id' },
  { name: 'USERNAME', uid: 'username' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' }
]
