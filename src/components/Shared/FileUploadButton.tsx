import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileUploadFormSchema } from '@/validation/FileUploadFormSchema';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../ui/use-toast';
import { CloudUpload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Doc } from '../../../convex/_generated/dataModel';

const FileUploadButton = ({ orgId }: { orgId: string }) => {
  const [isFileUploadDialogueOpen, setIsFileUploadDialogueOpen] =
    useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createFile = useMutation(api.files.createFile);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FileUploadFormSchema>>({
    resolver: zodResolver(FileUploadFormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const fileRef = form.register('file');

  async function onSubmit(values: z.infer<typeof FileUploadFormSchema>) {
    try {
      if (!orgId) return;
      const postUrl = await generateUploadUrl();
      const fileType = values.file[0].type;

      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': fileType },
        body: values.file[0],
      });

      const { storageId } = await result.json();

      const types = {
        'image/png': 'image',
        'application/pdf': 'pdf',
        'text/csv': 'csv',
        'image/jpeg': 'image',
      } as Record<string, Doc<'files'>['type']>;

      await createFile({
        name: values.file[0].name,
        fileId: storageId,
        orgId: orgId,
        type: types[fileType],
        storageId: storageId,
      });

      form.reset();
      setIsFileUploadDialogueOpen(false);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Now everyone can view your file',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: "Your file couldn't be uploaded, Try again later",
      });
    }
  }

  return (
    <>
      <Dialog
        open={isFileUploadDialogueOpen}
        onOpenChange={(isOpen: boolean) => {
          setIsFileUploadDialogueOpen(isOpen);
          form.reset();
        }}
      >
        <DialogTrigger asChild>
          <Button>Upload file</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-8">Upload your file</DialogTitle>
            <DialogDescription>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <div className="flex flex-col gap-4 mt-4">
                          <FormLabel>Choose your file</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1 items-center"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upload file
                    <CloudUpload
                      className={`ml-2 mr-2 h-4 w-4 ${form.formState.isSubmitting ? 'animate-pulse' : 'animate-none'}`}
                    />
                  </Button>
                </form>
              </FormProvider>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadButton;
