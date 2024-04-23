'use client';

import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import TopSection from '../Homepage/TopSection';
import FilesListingSection from '../Homepage/FilesListingSection';
import { DataTable } from '../FileTableView/TableView';
import { columns } from '../FileTableView/Columns';

const FileBrowser = ({
  favoriteOnly,
  deletedOnly,
}: {
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultView, setDefaultView] = useState<'grid' | 'table'>('grid');
  const [fileTypeFilter, setFileTypeFilter] = useState<
    'all' | 'image' | 'csv' | 'pdf'
  >('all');

  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;

  if (user.isLoaded && organization.isLoaded)
    orgId = organization.organization?.id ?? user.user?.id;

  const favorites = useQuery(
    api.files.getAllFavFiles,
    orgId ? { orgId } : 'skip'
  );

  const files: Array<Doc<'files'> & { url: string | null }> = useQuery(
    api.files.getFiles,
    orgId
      ? {
          orgId,
          query: searchQuery,
          favoriteOnly,
          deletedOnly,
          type: fileTypeFilter === 'all' ? undefined : fileTypeFilter,
        }
      : 'skip'
  )!;

  const isLoading = files === undefined;

  const modifiedFiles =
    (files &&
      files.map((file) => ({
        ...file,
        isFavorited: (favorites ?? []).some((fav) => fav.fileId === file._id),
      }))) ??
    [];

  return (
    <SignedIn>
      {isLoading ? (
        <div className="flex flex-col w-full items-center justify-center">
          <div className="h-80"></div>
          <Loader2 className="h-24 w-24 animate-spin text-gray-600" />
        </div>
      ) : (
        <div className="w-full">
          {orgId && (
            <div className="flex flex-col gap-11">
              <TopSection
                orgId={orgId}
                deletedOnly={deletedOnly}
                searchQuery={searchQuery}
                favoriteOnly={favoriteOnly}
                setSearchQuery={setSearchQuery}
                isEmpty={files && !files.length}
              />

              <FilesListingSection
                orgId={orgId}
                view={defaultView}
                files={modifiedFiles}
                setView={setDefaultView}
                deletedOnly={deletedOnly}
                favoriteOnly={favoriteOnly}
                fileTypeFilter={fileTypeFilter}
                setFileTypeFilter={setFileTypeFilter}
              />
            </div>
          )}
        </div>
      )}
    </SignedIn>
  );
};

export default FileBrowser;
