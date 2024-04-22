import { useState } from 'react';
import { Id } from '../../../convex/_generated/dataModel';
import { useToast } from '../ui/use-toast';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { ConvexError } from 'convex/values';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Download, EllipsisVerticalIcon, Heart, HeartCrack, Trash2, UndoIcon } from 'lucide-react';
import { Protect } from '@clerk/nextjs';

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
          <EllipsisVerticalIcon size={20} />
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

export default FileCardActions;
