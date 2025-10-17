import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useState } from 'react';
import { Button, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow,  Tooltip, useDisclosure } from '@heroui/react';
import type { Key } from 'react';
import type { Record, RecordTableColumn, UserQuery } from '@/lib/definitions'
import InternalError from '@/components/errors/internal-error';
import CreateRecordModal from '@/components/modals/records/create-record-modal';
import { EditIcon } from '@/components/svg/edit-icon';
import { DeleteIcon } from '@/components/svg/delete-icon';
import UpdateRecordModal from '@/components/modals/records/update-record-modal';
import { useQuery } from '@tanstack/react-query';
import { useUpdateRecordMutation } from '@/lib/mutations/use-update-record-mutation';
import { useCreateRecordMutation } from '@/lib/mutations/use-create-record-mutation';
import DeleteRecordModal from '@/components/modals/records/delete-record-modal';
import { useDeleteRecordMutation } from '@/lib/mutations/use-delete-record-mutation';
import { useUser } from '@/lib/mutations/use-user';

export const Route = createFileRoute('/records')({
  component: RouteComponent,
  errorComponent: InternalError
})

function RouteComponent() {
  const [page, setPage] = useState<number>(1);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);

  const createRecordModalDisclosure = useDisclosure();
  const updateRecordModalDisclosure = useDisclosure();
  const deleteRecordModalDisclosure = useDisclosure();

  const createRecordMutation = useCreateRecordMutation();
  const updateRecordMutation = useUpdateRecordMutation();
  const deleteRecordMutation = useDeleteRecordMutation();

  const rowsPerPage = 10;

  const fetchRecords = async (page: number) => {
    const offset = (page - 1) * rowsPerPage;

    const [recordsRes, countRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records?limit=${rowsPerPage}&offset=${offset}`),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/records/count`)
    ]);

    if (!recordsRes.ok || !countRes.ok) throw new Error();

    const recordsData = await recordsRes.json();
    const countData = await countRes.json();

    return {
      records: recordsData.data,
      totalCount: countData.count
    };
  };

  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["records", page],
    queryFn: () => fetchRecords(page),
  });

  const user: UserQuery = useUser();

  const totalCount = data?.totalCount ?? 0;
  const pages = Math.ceil(totalCount / rowsPerPage) || 1;

  const renderCell = useCallback((record: Record, columnKey: Key) => {
    const cellValue = record[columnKey as keyof Record];

    switch (columnKey) {
      case "id":
        return <p>{String(record.id)}</p>;
      case "temperature":
        return <p>{String(record.temperature) + " °C"}</p>;
      case "username":
        return <p>{record.username}</p>;
      case "uploaded_at":
        return <p>{new Date(record.uploaded_at).toLocaleDateString()}</p>;
      case "actions":
        if (user.data?.role === 'admin') {
          return (
            <div className="relative flex items-center gap-2 justify-center">
              <Tooltip content="Edit record">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedRecord(record);
                    updateRecordModalDisclosure.onOpen();
                  }}
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete record">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    setSelectedRecord(record);
                    deleteRecordModalDisclosure.onOpen();
                  }}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        } else return;
      default:
        return String(cellValue ?? "");
    }
  }, [updateRecordModalDisclosure, deleteRecordModalDisclosure]);

  if (
    isError ||
    user.isError ||
    createRecordMutation.isError ||
    updateRecordMutation.isError ||
    deleteRecordMutation.isError
  ) return <InternalError />;

  return (
    <>
      <div className="p-5 mb-5 rounded-xl bg-content1 font-bold text-2xl flex flex-row justify-between">
        <p className="font-bold text-2xl">Records</p>
        {user?.data?.role === 'admin' &&
          <Button
            variant="solid"
            color="primary"
            onPress={createRecordModalDisclosure.onOpen}
          >
            Create New Record
          </Button>
        }
      </div>

      <Table
        className="flex flex-1 items-center mx-auto"
        bottomContent={
          <div className="flex w-full justify-center">
          {!isLoading && !user.isLoading && (
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
                {column.uid === 'actions' && user?.data?.role !== 'admin' ? '' : column.name}
              </TableColumn>
            )}
          }
        </TableHeader>

        <TableBody
          items={isLoading || user.isLoading || !data ? [] : data?.records}
          emptyContent={"No records found."}
          isLoading={isLoading || user.isLoading || !data}
          loadingContent={<LoadingComp />}
        >
          {(item: Record) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {user?.data?.role === 'admin'
        ? (
          <CreateRecordModal
            isOpen={createRecordModalDisclosure.isOpen}
            onOpenChange={createRecordModalDisclosure.onOpenChange}
            mutation={createRecordMutation}
          />
        ) : null
      }

      {selectedRecord && user?.data?.role === 'admin' && (
        <>
          <UpdateRecordModal
            isOpen={updateRecordModalDisclosure.isOpen}
            onOpenChange={updateRecordModalDisclosure.onOpenChange}
            recordId={selectedRecord.id}
            recordValue={selectedRecord.temperature}
            mutation={updateRecordMutation}
          />

          <DeleteRecordModal
            isOpen={deleteRecordModalDisclosure.isOpen}
            onOpenChange={deleteRecordModalDisclosure.onOpenChange}
            record={selectedRecord}
            mutation={deleteRecordMutation}
          />
        </>
      )}
    </>
  );
}

function LoadingComp() {
  return (
    <div className='flex flex-col items-center justify-center my-auto'>
      <Spinner classNames={{label: "text-foreground/80 mt-4"}} label='Loading Records' variant='simple' />
    </div>
  );

}

const columns: Array<RecordTableColumn> = [
  { name: 'ID', uid: 'id' },
  { name: 'TEMPERATURE', uid: 'temperature' },
  { name: 'UPLOADED BY', uid: 'username' },
  { name: 'UPLOADED AT', uid: 'uploaded_at' },
  { name: 'ACTIONS', uid: 'actions' }
];
