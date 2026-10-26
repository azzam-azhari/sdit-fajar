import { requireRole } from '@/lib/supabase/auth-helpers';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/common/page-header';
import { ZebraDataTable } from '@/components/common/zebra-data-table';
type ScheduleRow={id:string;day_of_week:number;start_time:string;end_time:string;room:string|null};
export default async function JadwalPage(){await requireRole(['admin','super_admin','guru','murid','wali_murid']);const supabase=await createClient();const {data}=await supabase.from('schedules').select('id,day_of_week,start_time,end_time,room').order('day_of_week').order('start_time');return <div className="space-y-6"><PageHeader title="Jadwal Pelajaran" description="Jadwal mingguan ditata admin berdasarkan penugasan mengajar yang valid."/><ZebraDataTable<ScheduleRow> data={data??[]} columns={[{header:'Hari',cell:(r)=>['','Senin','Selasa','Rabu','Kamis','Jumat'][r.day_of_week]},{header:'Jam',cell:(r)=>`${r.start_time.slice(0,5)}–${r.end_time.slice(0,5)}`,isMono:true},{header:'Ruang',accessorKey:'room'}]} keyExtractor={(r)=>r.id} emptyText="Belum ada jadwal pelajaran."/></div>}
