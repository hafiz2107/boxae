import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FileUploadForm from '@/components/Shared/FileUploadForm';

const TopSection = ({ orgId }: { orgId: string }) => {
  const [isFileUploadDialogueOpen, setIsFileUploadDialogueOpen] =
    useState(false);

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold">Your Files</h1>

      <Dialog
        open={isFileUploadDialogueOpen}
        onOpenChange={setIsFileUploadDialogueOpen}
      >
        <DialogTrigger asChild>
          <Button>Upload file</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-8">Upload your file</DialogTitle>
            <DialogDescription>
              <FileUploadForm
                orgId={orgId}
                setDialogue={setIsFileUploadDialogueOpen}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopSection;
