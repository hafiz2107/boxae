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
import FileDropZone from './FileDropZone';

const FileUploadButton = ({ orgId }: { orgId: string }) => {
  const [isFileUploadDialogueOpen, setIsFileUploadDialogueOpen] =
    useState(false);

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
              <FileDropZone
                orgId={orgId}
                setDialogue={setIsFileUploadDialogueOpen}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadButton;
