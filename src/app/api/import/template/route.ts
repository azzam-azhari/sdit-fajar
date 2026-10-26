import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'siswa';

  let csvContent = '';
  let filename = '';

  if (type === 'siswa') {
    filename = 'template_import_siswa.csv';
    csvContent = `nis,name,gender,birth_place,birth_date,address,classroom_name
20260101,Ahmad Fatih Pratama,L,Depok,2019-05-12,Jl. Margonda Raya No. 45 Depok,1-A Abu Bakar
20260102,Fatimah Az-Zahra,P,Bogor,2019-08-20,Jl. Raya Sawangan No. 12 Depok,1-A Abu Bakar
20260103,Muhammad Rayyan,L,Jakarta,2019-03-15,Komp. Griya Fajar Indah Blok B3,1-B Umar
`;
  } else if (type === 'guru') {
    filename = 'template_import_guru.csv';
    csvContent = `nip,name,email,phone,nuptk
198501102010011001,Ustadz Abdullah S.Pd.I,abdullah@sdit-fajar.sch.id,081298765431,9876543210123456
199002152015022002,Ustadzah Nurul Hidayah M.Pd,nurul@sdit-fajar.sch.id,081298765432,8765432109876543
`;
  } else if (type === 'wali_murid') {
    filename = 'template_import_wali_murid.csv';
    csvContent = `parent_name,phone,email,relationship,student_nis
Hendra Pratama,081298765433,hendra@example.com,Ayah,20260101
Siti Aminah,081298765434,siti@example.com,Ibu,20260102
`;
  } else {
    return new NextResponse('Tipe template tidak dikenali.', { status: 400 });
  }

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
