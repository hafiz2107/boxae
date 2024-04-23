'use client';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

export const FileUploadProgressContext = createContext<{
  uploadProgress: number;
  setUploadProgress: Dispatch<SetStateAction<number>>;
}>({
  uploadProgress: 0,
  setUploadProgress: () => 0,
});

export function FileUploadProvider({ children }: { children: ReactNode }) {
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <FileUploadProgressContext.Provider
      value={{
        uploadProgress,
        setUploadProgress,
      }}
    >
      {children}
    </FileUploadProgressContext.Provider>
  );
}
