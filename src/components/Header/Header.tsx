import {
  OrganizationSwitcher,
  SignInButton,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import React from 'react';
import { Button } from '../ui/button';

const Header = () => {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex">
        Boxae
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
