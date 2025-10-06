'use client';

import { Button } from '@/components/ui/Button';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <Button className='w-[90px]' onClick={() => signOut({ callbackUrl: '/' })}>
      Sign Out
    </Button>
  );
}
