import InAppBrowserModal from '@/components/shared/in-app-browser-modal';

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InAppBrowserModal />
      {children}
    </>
  );
}
