import React from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import FileCard from '../Shared/FileCard';
import Image from 'next/image';
import FileUploadButton from '../Shared/FileUploadButton';

const FilesListingSection = ({
  files,
  orgId,
}: {
  files: (Doc<'files'> & { url: string | null })[];
  orgId: string;
}) => {
  return (
    <div>
      {files && !files.length && (
        <div className="flex flex-col gap-7 w-full items-center mt-52">
          <Image
            alt="No files to list"
            width={300}
            height={300}
            src="/empty.svg"
          />{' '}
          <div className="text-1xl">
            You have no files, Go ahead and upload one now
          </div>
          <div>
            <FileUploadButton orgId={orgId} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => <FileCard key={file._id} file={file} />)}
      </div>
    </div>
  );
};

export default FilesListingSection;
