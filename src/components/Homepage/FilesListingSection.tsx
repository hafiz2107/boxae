import React from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import FileCard from '../Shared/FileCard';

type Files = {
  _id: Id<'files'>;
  _creationTime: number;
  orgId?: string | undefined;
  name: string;
  fileId: Id<'_storage'>;
};

const FilesListingSection = ({ files }: { files: Doc<'files'>[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {files?.map((file) => <FileCard key={file._id} file={file} />)}
    </div>
  );
};

export default FilesListingSection;
