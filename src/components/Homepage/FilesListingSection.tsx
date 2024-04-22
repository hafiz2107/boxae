import React from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import FileCard from '../Shared/FileCard';
import Image from 'next/image';
import FileUploadButton from '../Shared/FileUploadButton';
import Link from 'next/link';
import { Button } from '../ui/button';

const FilesListingSection = ({
  fav,
  files,
  orgId,
}: {
  fav?: boolean;
  files: (Doc<'files'> & { url: string | null })[];
  orgId: string;
}) => {
  return (
    <div>
      {!fav && files && !files.length && (
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

      {files && fav && !files.length && (
        <div className="flex flex-col gap-7 w-full items-center mt-52">
          <Image
            alt="No files to list"
            width={300}
            height={300}
            src="/empty.svg"
          />{' '}
          <div className="text-1xl">
            You have no favorites, Go ahead and add one now
          </div>
          <div>
            <Link href="/dashboard/files">
              <Button>Show all files</Button>
            </Link>
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
