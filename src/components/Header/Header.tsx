import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image alt="Boxae logo" src="/boxae.png" height={40} width={40} />
            <p className="text-xl font-mono">Boxae</p>
          </div>
        </Link>
        <div className="flex gap-5">
          <OrganizationSwitcher />
          <UserButton />

          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Header;
