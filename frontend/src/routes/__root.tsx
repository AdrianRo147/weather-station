import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'

import { Sidebar } from '@/components/sidebar'
import { MobileSidebar } from '@/components/mobile-sidebar'
import NotFound from '@/components/errors/not-found'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className='dark bg-content2 text-foreground flex h-screen'>
      <div className='hidden md:block'>
        <Sidebar />
      </div>

      <div className='md:hidden'>
        <MobileSidebar />
      </div>

      <main className='flex-1 overflow-auto p-6 mt-[56px] md:mt-0'>
        <Outlet />
      </main>
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </div>
  ),
  notFoundComponent: () => (
    <NotFound />
  )
})
