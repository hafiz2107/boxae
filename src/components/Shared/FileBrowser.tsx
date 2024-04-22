'use client';

import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React, { useEffect, useState } from 'react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';
import TopSection from '../Homepage/TopSection';
import FilesListingSection from '../Homepage/FilesListingSection';

const FileBrowser = ({ fav }: { fav?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState('');
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
    orgId ? { orgId, query: searchQuery, fav } : 'skip'
  )!;

  const [showTopSection, setShowTopSection] = useState(false);

  const isLoading = files === undefined;

  useEffect(() => {
    if (!isLoading) {
      setShowTopSection(searchQuery ? true : Boolean(files && files.length));
    }
  }, [files, isLoading, searchQuery]);

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
              {showTopSection && (
                <TopSection
                  fav={fav}
                  orgId={orgId}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              )}
              {favorites && (
                <FilesListingSection
                  fav={fav}
                  favorites={favorites}
                  files={files}
                  orgId={orgId}
                />
              )}
            </div>
          )}
        </div>
      )}
    </SignedIn>
  );
};

export default FileBrowser;
