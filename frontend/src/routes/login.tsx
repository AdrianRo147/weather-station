import InternalError from '@/components/errors/internal-error';
import type { UserQuery } from '@/lib/definitions';
import { useLoginMutation } from '@/lib/mutations/use-login-mutation';
import { useUser } from '@/lib/mutations/use-user';
import { Button, Form, Input } from '@heroui/react'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react';
import { useState, type FormEvent } from 'react';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  errorComponent: InternalError
})

function RouteComponent() {
  const [error, setError] = useState<string | null>(null);
  const mutation = useLoginMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      username: string,
      password: string
    };

    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      setError(error.message)
    }
  };

  const user: UserQuery = useUser();

  if (user.data) return <Navigate to='/' />;

  if (error === "Database error") return <InternalError />

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='m-auto rounded-xl bg-content1 p-10 w-fit'>
        <h1 className='text-2xl font-bold'>Login</h1>
        <Form className="w-full max-w-xs mx-auto mt-6" onSubmit={onSubmit}>
          <Input
            isRequired
            errorMessage="Please enter a valid email"
            label="Username"
            labelPlacement="outside"
            name="username"
            placeholder="Enter your email"
            type="username"
            size='md'
            className='w-[20vw]'
          />
          <Input
            isRequired
            errorMessage="Please enter a valid password"
            label="Password"
            labelPlacement='outside'
            name='password'
            placeholder='Enter your password'
            type='password'
            size='md'
            className='w-[20vw]'
          />

          {error && (<p className='py-2 text-sm flex flex-row gap-2 items-center text-red-400'><CircleAlert size={16} /> {error}</p>)}

          <Button type="submit" variant="bordered" className='mt-4'>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  )
}
