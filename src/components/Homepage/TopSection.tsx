import React, { Dispatch } from 'react';

import FileUploadButton from '@/components/Shared/FileUploadButton';
import SearchBar from '../Shared/SearchBar';

const TopSection = ({
  fav,
  orgId,
  searchQuery,
  setSearchQuery,
}: {
  fav?:boolean;
  orgId: string;
  searchQuery: string;
  setSearchQuery: Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">{fav ? 'Favorites' :'Your Files' }</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FileUploadButton orgId={orgId} />
    </div>
  );
};

export default TopSection;
