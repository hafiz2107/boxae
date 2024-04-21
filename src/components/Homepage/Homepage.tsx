import { SignedIn, useOrganization, useUser } from '@clerk/nextjs';
import React from 'react';
import TopSection from './TopSection/TopSection';

const Homepage = () => {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;

  if (user.isLoaded && organization.isLoaded)
    orgId = organization.organization?.id ?? user.user?.id;

  return <SignedIn>{orgId && <TopSection orgId={orgId} />}</SignedIn>;
};

export default Homepage;
