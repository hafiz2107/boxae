import React, { ReactNode } from 'react';
import { Doc } from '../../../convex/_generated/dataModel';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import { FileImage, FileText, GanttChart } from 'lucide-react';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatRelative } from 'date-fns';
import { enGB } from 'date-fns/locale/en-GB';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import FileCardActions from './FileCardActions';

const FileCard = ({
  file,
}: {
  file: Doc<'files'> & { url: string | null; isFavorited: boolean };
}) => {
  const user = useQuery(api.users.getUserProfile, {
    userId: file.authorId,
  });

  const typeIcons = {
    image: <FileImage className="h-10 w-8" />,
    pdf: <FileText className="h-10 w-8" />,
    csv: <GanttChart className="h-10 w-8" />,
  } as Record<Doc<'files'>['type'], ReactNode>;

  const formatRelativeLocale = {
    lastWeek: "'Last' eeee 'at' hh:mm a",
    yesterday: "'Yesterday' 'at' hh:mm a",
    today: "'Today' 'at' hh:mm a",
    other: "dd.MM.yyyy 'at' hh:mm a",
  };

  const locale = {
    ...enGB,
    formatRelative: (token: any) => (formatRelativeLocale as any)[token],
  };

  return (
    <div>
      <Card>
        <CardHeader className="flex-wrap overflow-hidden">
          <CardTitle className="flex justify-between">
            <div className="flex gap-2 items-center justify-center text-nowrap overflow-hidden max-w-64">
              <div>{typeIcons[file.type]}</div>
              <div>
                <p className="text-sm">{file.name}</p>
                <p className="text-xs text-gray-400">
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-2 cursor-pointer">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={user?.image} />
                          <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                        {formatRelative(
                          new Date(file._creationTime),
                          new Date(),
                          {
                            locale,
                          }
                        )}
                      </div>
                    </HoverCardTrigger>

                    <HoverCardContent>
                      <div className="flex  gap-4">
                        <div>
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={user?.image} />
                            <AvatarFallback>US</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col gap-3">
                          <p className="font-semibold text-lg">{user?.name}</p>

                          <p>
                            {formatRelative(
                              new Date(file._creationTime),
                              new Date(),
                              {
                                locale,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </p>
              </div>
            </div>
            <FileCardActions
              key={file._id}
              fileId={file._id}
              fileUrl={file.url!}
              userId={file.authorId}
              isFavourited={file.isFavorited}
              isMarkedAsDelete={file.shouldDelete}
            />
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

          <CardFooter className="flex w-full justify-between">
            <div className="flex items-center gap-2"></div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default FileCard;
