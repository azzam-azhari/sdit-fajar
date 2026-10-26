'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/actions/auth.actions';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAction();
    } catch {
      // Handled by redirect
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
    >
      {loading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="mr-1.5 h-3.5 w-3.5" />
      )}
      Keluar
    </Button>
  );
}
