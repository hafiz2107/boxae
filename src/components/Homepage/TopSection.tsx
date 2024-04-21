import React from 'react';

import FileUploadButton from '@/components/Shared/FileUploadButton';

const TopSection = ({ orgId }: { orgId: string }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">Your Files</h1>
      <FileUploadButton orgId={orgId} />
    </div>
  );
};

export default TopSection;
