'use client';

import { Button } from '@/components/ui/Button';
import useTranslation from '@/hooks/useTranslation';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const { t } = useTranslation()

  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/' })}
      variant='logOut'>
      {t('signOut')}
    </Button>
  );
}
