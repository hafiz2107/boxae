import React, { ReactNode, useState } from 'react';
import { Doc, Id } from '../../../convex/_generated/dataModel';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowDownToLine,
  EllipsisVertical,
  FileImage,
  FileText,
  GanttChart,
  Trash2,
} from 'lucide-react';
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
} from '../ui/alert-dialog';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';

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

const FileCard = ({
  file,
}: {
  file: Doc<'files'> & { url: string | null };
}) => {
  const typeIcons = {
    image: <FileImage />,
    pdf: <FileText />,
    csv: <GanttChart />,
  } as Record<Doc<'files'>['type'], ReactNode>;
  return (
    <div>
      <Card>
        <CardHeader className="flex-wrap overflow-hidden">
          <CardTitle className="flex justify-between">
            <div className="flex gap-2 text-nowrap overflow-hidden max-w-64">
              <div>{typeIcons[file.type]}</div>
              <p className="text-sm">{file.name}</p>
            </div>
            <FileCardActions key={file._id} fileId={file._id} />
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

          <CardFooter className="flex justify-center">
            <Button
              size={'sm'}
              variant="ghost"
              onClick={() => {
                file.url && window.open(file.url, '_blank');
              }}
            >
              <ArrowDownToLine size={15} />
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default FileCard;
