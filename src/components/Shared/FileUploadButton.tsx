import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

import { Button } from '../ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Id } from '../../../convex/_generated/dataModel';

import { UploadDropzone, UploadFileResponse } from '@xixixao/uploadstuff/react';
import '@xixixao/uploadstuff/react/styles.css';
import { FileUploadProgressContext } from '@/Providers/FileUploadProgressProvider';

const FileUploadButton = ({ orgId }: { orgId: string }) => {
  const [isFileUploadDialogueOpen, setIsFileUploadDialogueOpen] =
    useState(false);

  const { setUploadProgress } = useContext(FileUploadProgressContext);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const { toast } = useToast();

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await createFile({
      orgId: orgId,
      uploads: uploaded as unknown as {
        name: string;
        type: string;
        size: number;
        response: { storageId: Id<'_storage'> };
      }[],
    });

    toast({
      variant: 'success',
      title: 'Success',
      description: 'Now everyone can view your file',
    });

    setUploadProgress(0);
  };

  return (
    <>
      <Dialog
        open={isFileUploadDialogueOpen}
        onOpenChange={(isOpen: boolean) => {
          setIsFileUploadDialogueOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button>Upload file</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-8">Upload your file</DialogTitle>
            <DialogDescription>
              <UploadDropzone
                uploadUrl={generateUploadUrl}
                fileTypes={{
                  'application/pdf': ['.pdf'],
                  'image/*': ['.png'],
                  'text/csv': ['.csv'],
                }}
                multiple
                onUploadBegin={() => setIsFileUploadDialogueOpen(false)}
                onUploadComplete={saveAfterUpload}
                onUploadError={() => {
                  setIsFileUploadDialogueOpen(false);
                  toast({
                    variant: 'destructive',
                    title: 'Failed',
                    description:
                      "Your file couldn't be uploaded, Try again later",
                  });
                }}
                onUploadProgress={(progress) => {
                  setUploadProgress(progress);
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadButton;
