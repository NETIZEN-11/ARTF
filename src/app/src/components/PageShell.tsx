import Navigation from '@app/components/Navigation';
import { PostHogProvider } from '@app/components/PostHogProvider';
import UpdateBanner from '@app/components/UpdateBanner';
import { Outlet } from 'react-router-dom';
import { PostHogPageViewTracker } from './PostHogPageViewTracker';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {children}
    </div>
  );
}

export default function PageShell() {
  return (
    <PostHogProvider>
      <Layout>
        <Navigation />
        <UpdateBanner />
        <main>
          <Outlet />
        </main>
        <PostHogPageViewTracker />
      </Layout>
    </PostHogProvider>
  );
}
