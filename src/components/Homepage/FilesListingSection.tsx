import React, { useContext } from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import GridView from './GridView';
import TableView from './TableView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GridIcon, Rows2Icon } from 'lucide-react';
import NoContents from './NoContents';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '../ui/progress';
import { FileUploadProgressContext } from '@/Providers/FileUploadProgressProvider';

const FilesListingSection = ({
  view,
  files,
  orgId,
  setView,
  deletedOnly,
  favoriteOnly,
  fileTypeFilter,
  setFileTypeFilter,
}: {
  fileTypeFilter: 'all' | 'image' | 'csv' | 'pdf';
  view: string;
  setView: React.Dispatch<React.SetStateAction<'grid' | 'table'>>;
  setFileTypeFilter: React.Dispatch<
    React.SetStateAction<'all' | 'image' | 'csv' | 'pdf'>
  >;
  favoriteOnly?: boolean;
  deletedOnly?: boolean;
  files: (Doc<'files'> & { url: string | null; isFavorited: boolean })[];
  orgId: string;
}) => {
  const { uploadProgress } = useContext(FileUploadProgressContext);

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
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-center gap-8">
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

              {Boolean(uploadProgress) && (
                <div className="flex flex-col gap-1">
                  <p className="animate-pulse text-sm">Uploading file</p>
                  <Progress
                    value={uploadProgress}
                    className="w-40 mb-8 animate-pulse"
                  />
                </div>
              )}
            </div>

            <div className="mb-8">
              <Select
                value={fileTypeFilter}
                onValueChange={(v: 'all' | 'image' | 'csv' | 'pdf') =>
                  setFileTypeFilter(v)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All File Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
