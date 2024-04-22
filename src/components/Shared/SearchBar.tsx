import React, { Dispatch } from 'react';

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

import { CloudUpload, Loader2 } from 'lucide-react';
import { FilterFormSchema } from '@/validation/FilterFormSchema';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: Dispatch<React.SetStateAction<string>>;
}) => {
  const form = useForm<z.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      filter: searchQuery,
    },
  });

  const filterRef = form.register('filter');

  async function onSubmit(values: z.infer<typeof FilterFormSchema>) {
    try {
      setSearchQuery(values.filter);
    } catch (err) {}
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
          <div>
            <FormField
              control={form.control}
              name="filter"
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Search..." {...filterRef} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex gap-1 items-center"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SearchBar;
