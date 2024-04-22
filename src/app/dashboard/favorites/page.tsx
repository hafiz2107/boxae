import FileBrowser from '@/components/Shared/FileBrowser';
import React from 'react';

const FavoritesPage = () => {
  return <FileBrowser favoriteOnly={true} />;
};

export default FavoritesPage;
