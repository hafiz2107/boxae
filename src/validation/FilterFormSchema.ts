import { z } from 'zod';

export const FilterFormSchema = z.object({
  filter: z.string().min(0).max(200),
});
