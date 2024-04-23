import React, { useContext } from 'react';

import { UploadDropzone, UploadFileResponse } from '@xixixao/uploadstuff/react';
import { FileUploadProgressContext } from '@/Providers/FileUploadProgressProvider';
import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useToast } from '../ui/use-toast';
import { Id } from '../../../convex/_generated/dataModel';
import '@xixixao/uploadstuff/react/styles.css';
const FileDropZone = ({
  orgId,
  setDialogue,
}: {
  orgId: string;
  setDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
    <UploadDropzone
      className={({ isDragActive }) =>
        `flex flex-col p-10 items-center justify-center text-black border-4 bg-gray-50 
       ${isDragActive ? 'border-dashed border-gray-300 bg-gray-100 animate-pulse' : 'border-4'}`
      }
      uploadUrl={generateUploadUrl}
      fileTypes={{
        'application/pdf': ['.pdf'],
        'image/*': ['.png'],
        'text/csv': ['.csv'],
      }}
      multiple
      onUploadBegin={() => setDialogue(false)}
      onUploadComplete={saveAfterUpload}
      onUploadError={() => {
        setDialogue(false);
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: "Your file couldn't be uploaded, Try again later",
        });
      }}
      onUploadProgress={(progress) => {
        setUploadProgress(progress);
      }}
    />
  );
};

export default FileDropZone;
