import { CircleAlert } from "lucide-react";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CircleAlert size={52} className='mb-6'/>
      <h1 className="text-3xl font-bold">404 - Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-200">Requested page could not be found.</p>
      <Button as={ Link } to='/' color='primary' className='mt-4 text-blue-500' variant='flat'>
        Go Home
      </Button>
    </div>
  );
}
