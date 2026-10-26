'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateSchoolSettingsAction } from '@/actions/super-admin.actions';
import { School, Phone, Mail, MapPin, Globe, Save } from 'lucide-react';

interface SchoolSettingsItem {
  id?: string;
  school_name?: string;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  maps_url?: string | null;
}

export function SchoolSettingsForm({
  initialSettings,
}: {
  initialSettings?: SchoolSettingsItem | null;
}) {
  const [isPending, startTransition] = React.useTransition();

  const [schoolName, setSchoolName] = React.useState(
    initialSettings?.school_name || 'SDIT Fajar'
  );
  const [address, setAddress] = React.useState(
    initialSettings?.address || 'Jl. H. Dimun Raya No. 45, Sukamaju, Cilodong, Kota Depok, Jawa Barat'
  );
  const [phone, setPhone] = React.useState(
    initialSettings?.phone || '(021) 7782-9901'
  );
  const [whatsapp, setWhatsapp] = React.useState(
    initialSettings?.whatsapp || '0812-9876-5430'
  );
  const [email, setEmail] = React.useState(
    initialSettings?.email || 'info@sdit-fajar.sch.id'
  );
  const [mapsUrl, setMapsUrl] = React.useState(
    initialSettings?.maps_url || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateSchoolSettingsAction({
        school_name: schoolName,
        address,
        phone,
        whatsapp,
        email,
        maps_url: mapsUrl || null,
      });

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <School className="size-4 text-primary" />
            Profil & Kontak Resmi SDIT Fajar
          </CardTitle>
          <CardDescription className="text-xs">
            Perubahan identitas ini langsung berdampak pada footer web publik, kwitansi cetak, dan portal PPDB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-xs">Nama Resmi Institusi Sekolah</Label>
            <Input
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs flex items-center gap-1.5">
              <MapPin className="size-3 text-muted-foreground" />
              Alamat Lengkap Sekolah
            </Label>
            <Input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1.5">
                <Phone className="size-3 text-muted-foreground" />
                Nomor Telepon Kantor
              </Label>
              <Input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1.5">
                <Phone className="size-3 text-emerald-600" />
                Nomor WhatsApp Layanan PPDB / Sekolah
              </Label>
              <Input
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                Alamat Email Resmi Sekolah
              </Label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1.5">
                <Globe className="size-3 text-muted-foreground" />
                Tautan Embed Google Maps (Opsional)
              </Label>
              <Input
                type="url"
                placeholder="https://maps.google.com/..."
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-2 border-t border-border/60">
          <Button type="submit" size="sm" className="text-xs h-9" disabled={isPending}>
            <Save className="size-3.5 mr-1.5" />
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
