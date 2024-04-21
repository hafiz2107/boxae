import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import React from 'react';
import TopSection from './TopSection';
import FilesListingSection from './FilesListingSection';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const Homepage = () => {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;

  if (user.isLoaded && organization.isLoaded)
    orgId = organization.organization?.id ?? user.user?.id;

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');

  return (
    <SignedIn>
      {orgId && (
        <div className="flex flex-col gap-11">
          <TopSection orgId={orgId} />
          {files ? <FilesListingSection files={files} /> : 'No Files'}
        </div>
      )}
    </SignedIn>
  );
};

export default Homepage;
