import InAppBrowserModal from '@/components/shared/in-app-browser-modal';
import { UploadQueueProvider } from '@/components/guest/upload-queue-provider';

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <UploadQueueProvider>
      <InAppBrowserModal />
      {children}
    </UploadQueueProvider>
  );
}
