import React, { ReactNode, useState } from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import {
  Download,
  EllipsisVertical,
  FileImage,
  FileText,
  GanttChart,
  Heart,
  HeartCrack,
  Trash2,
  UndoIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';
import { Protect } from '@clerk/nextjs';
import { ConvexError } from 'convex/values';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';

function FileCardActions({
  fileId,
  fileUrl,
  isFavourited,
  isMarkedAsDelete,
}: {
  fileId: Id<'files'>;
  fileUrl: string;
  isFavourited: boolean;
  isMarkedAsDelete?: boolean;
}) {
  const [cnfrmDialogue, setConfrmDialogue] = useState(false);
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFav = useMutation(api.files.toggleFav);
  const restoreFile = useMutation(api.files.restoreFile);

  const handleFileDelete = async () => {
    try {
      await deleteFile({
        fileId: fileId,
      });

      toast({
        variant: 'success',
        title: 'File have been moved to trash',
        description: 'Your file will be deleted soon',
      });
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError ? error.data : 'Unexpected error occurred';

      toast({
        variant: 'destructive',
        title: 'Failed to delete file',
        description: errorMessage,
      });
    }
  };
  return (
    <>
      <AlertDialog open={cnfrmDialogue} onOpenChange={setConfrmDialogue}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will move your file to the trash and will be delete
              after 30 days.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFileDelete}
              className="border border-red-600 bg-white text-red-600 hover:bg-red-300"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-4 items-center justify-start"
            onClick={() =>
              toggleFav({
                fileId: fileId,
              })
            }
          >
            {!isFavourited && (
              <Heart
                size={20}
                fill={isFavourited ? 'red' : 'white'}
                color={isFavourited ? 'red' : 'black'}
              />
            )}
            {isFavourited && <HeartCrack size={20} />}
            {isFavourited ? 'Remove from Favorites' : 'Add to Favorites'}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex gap-4 items-center justify-start"
            onClick={() => fileUrl && window.open(fileUrl, '_blank')}
          >
            <Download size={20} /> Download file
          </DropdownMenuItem>

          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-start"
              onClick={() => {
                if (isMarkedAsDelete) {
                  restoreFile({ fileId: fileId });
                } else {
                  setConfrmDialogue(true);
                }
              }}
            >
              {isMarkedAsDelete ? (
                <div className="flex gap-4 text-green-600 items-center">
                  <UndoIcon size={20} />
                  Restore item
                </div>
              ) : (
                <div className="flex gap-4 text-red-600 items-center">
                  <Trash2 size={20} />
                  Move to trash
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const FileCard = ({
  file,
  isFavourited,
}: {
  file: Doc<'files'> & { url: string | null };
  isFavourited: boolean;
}) => {
  const user = useQuery(api.users.getUserProfile, {
    userId: file.authorId,
  });

  const typeIcons = {
    image: <FileImage />,
    pdf: <FileText />,
    csv: <GanttChart />,
  } as Record<Doc<'files'>['type'], ReactNode>;

  const formatRelativeLocale = {
    lastWeek: "'Last' eeee 'at' hh:mm a",
    yesterday: "'Yesterday' 'at' hh:mm a",
    today: "'Today' 'at' hh:mm a",
    other: "dd.MM.yyyy 'at' hh:mm a",
  };

  const locale = {
    ...enGB,
    formatRelative: (token: any) => (formatRelativeLocale as any)[token],
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex-wrap overflow-hidden">
          <CardTitle className="flex justify-between">
            <div className="flex gap-2 items-center justify-center text-nowrap overflow-hidden max-w-64">
              <div>{typeIcons[file.type]}</div>
              <div>
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {formatRelative(new Date(file._creationTime), new Date(), {
                    locale,
                  })}
                </p>
              </div>
            </div>
            <FileCardActions
              key={file._id}
              fileId={file._id}
              fileUrl={file.url!}
              isFavourited={isFavourited}
              isMarkedAsDelete={file.shouldDelete}
            />
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-3">
          <CardContent className="max-h-40 min-h-40 overflow-hidden flex justify-center items-center">
            {file.url && file.type === 'image' && (
              <Image alt={'Preview'} height={100} width={200} src={file.url} />
            )}
            {file.url && file.type === 'csv' && (
              <GanttChart className="w-20 h-20" />
            )}
            {file.url && file.type === 'pdf' && (
              <FileText className="w-20 h-20" />
            )}
          </CardContent>

          <CardFooter className="flex w-full justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={user?.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default FileCard;
