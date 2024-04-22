'use client';

import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import TopSection from './TopSection';
import FilesListingSection from './FilesListingSection';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Loader2 } from 'lucide-react';
import { Doc } from '../../../convex/_generated/dataModel';

const Homepage = () => {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;

  if (user.isLoaded && organization.isLoaded)
    orgId = organization.organization?.id ?? user.user?.id;

  const files: Array<Doc<'files'> & { url: string | null }> = useQuery(
    api.files.getFiles,
    orgId ? { orgId } : 'skip'
  )!;

  const [showTopSection, setShowTopSection] = useState(false);

  const isLoading = files === undefined;

  useEffect(() => {
    if (!isLoading) {
      setShowTopSection(Boolean(files && files.length));
    }
  }, [files, isLoading]);

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
              <TopSection onAddingFile={setShowTopSection} orgId={orgId} />
            )}
            {<FilesListingSection files={files} orgId={orgId} />}
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Homepage;
