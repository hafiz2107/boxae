import React, { Dispatch } from 'react';

import FileUploadButton from '@/components/Shared/FileUploadButton';
import SearchBar from '../Shared/SearchBar';
import { Progress } from '../ui/progress';

const TopSection = ({
  orgId,
  isEmpty,
  deletedOnly,
  searchQuery,
  favoriteOnly,
  setSearchQuery,
}: {
  orgId: string;
  isEmpty: boolean;
  searchQuery: string;
  deletedOnly?: boolean;
  favoriteOnly?: boolean;
  setSearchQuery: Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">
        {favoriteOnly ? 'Favorites' : deletedOnly ? 'Trash' : 'Your Files'}
      </h1>

      {!isEmpty && (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <FileUploadButton orgId={orgId} />
        </>
      )}
    </div>
  );
};

export default TopSection;
