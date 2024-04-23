import React, { useState } from 'react';

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
import { Doc, Id } from '../../../convex/_generated/dataModel';

import { UploadDropzone, UploadFileResponse } from '@xixixao/uploadstuff/react';
import '@xixixao/uploadstuff/react/styles.css';

const FileUploadButton = ({ orgId }: { orgId: string }) => {
  const [isFileUploadDialogueOpen, setIsFileUploadDialogueOpen] =
    useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const { toast } = useToast();

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    setIsFileUploadDialogueOpen(false);
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
                onUploadComplete={saveAfterUpload}
                multiple
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
                  console.log('Upload prgress -> ', progress);
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
