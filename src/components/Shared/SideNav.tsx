'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { FileIcon, Heart, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Progress } from '../ui/progress';

const SideNav = () => {
  const path = usePathname();
  return (
    <div className=" h-full w-64">
      <div className="flex flex-col gap-5">
        <Link href="/dashboard/files">
          <Button
            variant={path.includes('/dashboard/files') ? 'secondary' : 'link'}
            className={clsx('flex gap-6 w-52 items-center justify-start', {
              'font-bold': path.includes('/dashboard/files'),
            })}
          >
            <FileIcon /> All Files
          </Button>
        </Link>

        <Link href="/dashboard/favorites">
          <Button
            variant={
              path.includes('/dashboard/favorites') ? 'secondary' : 'link'
            }
            className={clsx('flex gap-6 w-52 items-center justify-start', {
              'font-bold': path.includes('/dashboard/favorites'),
            })}
          >
            <Heart />
            Favorites
          </Button>
        </Link>

        <Link href="/dashboard/trash">
          <Button
            variant={path.includes('/dashboard/trash') ? 'secondary' : 'link'}
            className={clsx('flex gap-6 w-52 items-center justify-start', {
              'font-bold': path.includes('/dashboard/trash'),
            })}
          >
            <Trash2 />
            Trash
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
