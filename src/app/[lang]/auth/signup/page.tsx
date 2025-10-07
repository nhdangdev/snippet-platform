'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/components/ui/Link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import useTranslation from '@/hooks/useTranslation';

export default function SignUp() {
  const {t} = useTranslation()
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        router.push('/auth/signin?registered=true');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.log('🚀 ~ handleSubmit ~ error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='md:mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link
              href='/auth/signin'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='text-sm text-red-800'>{error}</div>
            </div>
          )}
          <div className='flex flex-col gap-4'>
            <div>
              <label htmlFor='name' className='sr-only'>
                Full name
              </label>
              <Input
                id='name'
                name='name'
                type='text'
                autoComplete='name'
                required
                className='rounded-md'
                placeholder='Full name'
              />
            </div>
            <div>
              <label htmlFor='email' className='sr-only'>
                Email address
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='rounded-md'
                placeholder='Email address'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='rounded-md'
                placeholder='Password (min 6 characters)'
              />
            </div>
            <div>
              <label htmlFor='confirmPassword' className='sr-only'>
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                required
                className='rounded-md'
                placeholder='Confirm password'
              />
            </div>
          </div>

          <div>
            <Button
              type='submit'
              disabled={loading}
              variant='primary'
              className='w-full'
            >
              {loading ? 'Creating account...' : t('signUp')}
            </Button>
          </div>
          <Link
            href='/'
            className='font-medium w-full flex justify-center hover:underline items-center text-blue-600 hover:text-blue-500'
          >
            {t('back_to_home')}
          </Link>
        </form>
      </div>
    </div>
  );
}
