import { CircleAlert } from "lucide-react";
import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";

export default function InternalError() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CircleAlert size={52} className='mb-6'/>
      <h1 className="text-3xl font-bold">500 - Internal Server Error</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-200">Internal Server Error occured while trying to serve this page. Please, try again later.</p>
      <Button as={ Link } to='/' color='primary' className='mt-4 text-blue-500' variant='flat'>
        Go Home
      </Button>
    </div>
  );
}
