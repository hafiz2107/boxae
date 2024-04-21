import { z } from 'zod';

export const FileUploadFormSchema: any = z.object({
  file: z
    .custom<FileList>((val) => val instanceof FileList, 'The file is required')
    .refine((files) => files.length > 0, 'The file is required'),
});
