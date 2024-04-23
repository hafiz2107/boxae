import type { Metadata } from 'next';
import SideNav from '@/components/Shared/SideNav';
import Header from '@/components/Header/Header';
import { FileUploadProvider } from '@/Providers/FileUploadProgressProvider';

export const metadata: Metadata = {
  title: 'Boxae',
  description: 'A file storage',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="">
      <FileUploadProvider>
        <Header />
        <div className="container pt-12 pl-0 pr-0">
          <div className="flex w-full">
            <SideNav />
            {children}
          </div>
        </div>
      </FileUploadProvider>
    </main>
  );
}
