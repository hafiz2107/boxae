import React from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import GridView from './GridView';
import TableView from './TableView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GridIcon, Rows2Icon } from 'lucide-react';
import NoContents from './NoContents';

const FilesListingSection = ({
  view,
  setView,
  favoriteOnly,
  deletedOnly,
  files,
  orgId,
}: {
  view: string;
  setView: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
  files: (Doc<'files'> & { url: string | null; isFavorited: boolean })[];
  orgId: string;
}) => {
  return (
    <div>
      {files && !files.length ? (
        <NoContents
          files={files}
          orgId={orgId}
          deletedOnly={deletedOnly}
          favoriteOnly={favoriteOnly}
        />
      ) : (
        <Tabs defaultValue={view}>
          <TabsList className="mb-8">
            <TabsTrigger
              value="grid"
              className="flex gap-2 items-center"
              onClick={() => setView('grid')}
            >
              <GridIcon />
              Grid view
            </TabsTrigger>

            <TabsTrigger
              value="table"
              className="flex gap-2 items-center"
              onClick={() => setView('table')}
            >
              <Rows2Icon />
              Table view
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <GridView
              files={files}
              orgId={orgId}
              deletedOnly={deletedOnly}
              favoriteOnly={favoriteOnly}
            />
          </TabsContent>

          <TabsContent value="table">
            <TableView files={files} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FilesListingSection;
