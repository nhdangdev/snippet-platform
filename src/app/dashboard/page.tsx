import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';
import { Container } from '@/components/ui/Container';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-sm'>
        <Container>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <h1 className='text-xl font-bold'>Snippet Platform</h1>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-700'>
                {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </Container>
      </nav >

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='bg-white shadow rounded-lg p-6'>
            <h2 className='text-2xl font-bold mb-4'>
              Welcome to your Dashboard!
            </h2>
            <div className='space-y-2'>
              <p className='text-gray-600'>
                <strong>User ID:</strong> {session.user.id}
              </p>
              <p className='text-gray-600'>
                <strong>Name:</strong> {session.user.name}
              </p>
              <p className='text-gray-600'>
                <strong>Email:</strong> {session.user.email}
              </p>
            </div>

            <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
              <h3 className='font-semibold text-blue-900 mb-2'>
                Authentication is working!
              </h3>
              <p className='text-blue-800 text-sm'>
                You are now logged in to your <strong>{session.user.name}</strong> account.
                Only authenticated users can access this page.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div >
  );
}
