import React from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import FileCard from '../Shared/FileCard';
import Image from 'next/image';
import FileUploadButton from '../Shared/FileUploadButton';
import Link from 'next/link';
import { Button } from '../ui/button';

const FilesListingSection = ({
  favoriteOnly,
  deletedOnly,
  favorites,
  files,
  orgId,
}: {
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
  favorites: Doc<'favorites'>[];
  files: (Doc<'files'> & { url: string | null })[];
  orgId: string;
}) => {
  return (
    <div>
      {deletedOnly && !favoriteOnly && files && !files.length && (
        <div className="flex flex-col gap-7 w-full items-center mt-52">
          <Image
            alt="No files in trash"
            width={300}
            height={300}
            src="/empty-trash.svg"
          />
          <div className="text-1xl">
            You have nothing on your trash, Go ahead explore you files
          </div>
          <div>
            <Link href="/dashboard/files">
              <Button>Show all files</Button>
            </Link>
          </div>
        </div>
      )}

      {favoriteOnly && !deletedOnly && files && !files.length && (
        <div className="flex flex-col gap-7 w-full items-center mt-52">
          <Image
            alt="No files to list"
            width={300}
            height={300}
            src="/empty-favs.svg"
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

      {!deletedOnly && !favoriteOnly && files && !files.length && (
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
        {files?.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            isFavourited={favorites.some((fav) => fav.fileId === file._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FilesListingSection;
