import React from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import FileCard from '../Shared/FileCard';
import NoContents from './NoContents';

const GridView = ({
  favoriteOnly,
  deletedOnly,
  files,
  orgId,
}: {
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
  files: (Doc<'files'> & { url: string | null; isFavorited: boolean })[];
  orgId: string;
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {files?.map((file) => <FileCard key={file._id} file={file} />)}
    </div>
  );
};

export default GridView;
