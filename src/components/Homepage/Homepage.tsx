'use client';

import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import TopSection from './TopSection';
import FilesListingSection from './FilesListingSection';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { FileIcon, Heart, Loader2, Trash2 } from 'lucide-react';
import { Doc } from '../../../convex/_generated/dataModel';
import { Button } from '../ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;

  if (user.isLoaded && organization.isLoaded)
    orgId = organization.organization?.id ?? user.user?.id;

  const files: Array<Doc<'files'> & { url: string | null }> = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query: searchQuery } : 'skip'
  )!;

  const [showTopSection, setShowTopSection] = useState(false);

  const isLoading = files === undefined;

  useEffect(() => {
    if (!isLoading) {
      setShowTopSection(searchQuery ? true : Boolean(files && files.length));
    }
  }, [files, isLoading, searchQuery]);

  return isLoading ? (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="h-80"></div>
      <Loader2 className="h-24 w-24 animate-spin text-gray-600" />
    </div>
  ) : (
    <div>
      <SignedIn>
        {orgId && (
          <div className="flex flex-col gap-11">
            {showTopSection && (
              <TopSection
                orgId={orgId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {<FilesListingSection files={files} orgId={orgId} />}
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Homepage;
