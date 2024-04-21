import React, { useState } from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { ArrowDownToLine, EllipsisVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';

function FileCardActions({ fileId }: { fileId: Id<'files'> }) {
  const [cnfrmDialogue, setConfrmDialogue] = useState(false);
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);

  const handleFileDelete = async () => {
    try {
      await deleteFile({
        fileId: fileId,
      });

      toast({
        variant: 'success',
        title: 'File deleted',
        description: 'Successfully deleted file',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Failed to deleted file',
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
              This action cannot be undone. This will permanently delete your
              file and remove your data from our servers.
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
            className="flex gap-4 text-red-600 items-center justify-center"
            onClick={() => setConfrmDialogue(true)}
          >
            Delete <Trash2 />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const FileCard = ({ file }: { file: Doc<'files'> }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            {file.name} <FileCardActions key={file._id} fileId={file._id} />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p>Card Content</p>
        </CardContent>

        <CardFooter>
          <Button size={'sm'} variant="ghost">
            <ArrowDownToLine size={15} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FileCard;
