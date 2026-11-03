'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { hostTokens, SIGNED_OUT_EVENT } from '@/lib/api/http';
import type { User } from '@/lib/api/types';

function subscribe(onChange: () => void) {
  window.addEventListener(SIGNED_OUT_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(SIGNED_OUT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** Whether a host token is stored. Null on the server, before hydration. */
function useHasToken(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => !!hostTokens.access(),
    () => null,
  );
}

/**
 * For host and admin pages: sends signed-out visitors (and anyone without
 * `role`) to /login, coming back here afterwards.
 */
export function useAuth({ role }: { role?: User['role'] } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const hasToken = useHasToken();

  const { data: user, isError } = useQuery({
    queryKey: ['current-user'],
    queryFn: api.getCurrentUser,
    enabled: hasToken === true,
    staleTime: 5 * 60_000,
    retry: false,
  });

  const allowed = !!user && (!role || user.role === role);

  useEffect(() => {
    if (hasToken === false || isError) {
      queryClient.clear();
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasToken, isError, pathname, queryClient, router]);

  const signOut = async () => {
    await api.signOut();
    queryClient.clear();
    router.replace('/login');
  };

  return {
    user: user ?? null,
    /** True until we know who's signed in. */
    loading: hasToken !== false && !user && !isError,
    allowed,
    /** Signed in, but without the role this page needs. */
    forbidden: !!user && !!role && user.role !== role,
    signOut,
  };
}
