'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import { formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import FileCardActions from '../Shared/FileCardActions';

const formatRelativeLocale = {
  lastWeek: "'Last' eeee 'at' hh:mm a",
  yesterday: "'Yesterday' 'at' hh:mm a",
  today: "'Today' 'at' hh:mm a",
  other: "dd.MM.yyyy 'at' hh:mm a",
};

const locale = {
  ...enGB,
  formatRelative: (token: any) => (formatRelativeLocale as any)[token],
};

function UserCell({ userId }: { userId: Id<'users'> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: userId,
  });

  return (
    <div className="flex  gap-4">
      <div>
        <Avatar className="w-8 h-8">
          <AvatarImage src={userProfile?.image} />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex gap-3 items-center">
        <p className="">{userProfile?.name}</p>
      </div>
    </div>
  );
}
export const columns: ColumnDef<
  Doc<'files'> & { url: string | null; isFavorited: boolean }
>[] = [
  {
    accessorKey: 'name',
    header: 'File name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'Uploaded on',
    cell: ({ row }) => (
      <div>
        {formatRelative(new Date(row.original._creationTime), new Date(), {
          locale,
        })}
      </div>
    ),
  },

  {
    header: 'Author',
    cell: ({ row }) =>
      UserCell({
        userId: row.original.authorId,
      }),
  },
  {
    header: 'Actions',
    cell: ({ row }) => (
      <FileCardActions
        fileId={row.original._id}
        fileUrl={row.original.url!}
        isFavourited={row.original.isFavorited}
        isMarkedAsDelete={row.original.shouldDelete}
      />
    ),
  },
];
