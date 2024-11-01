import Airtable from 'airtable'

import type { GuestData } from '~~/types'

export default function useAirtable() {
  const apiKey =
    'patYINjjyje7bmFeN.69963b1980d0f7e130990faf1ed846b00bc4106dd846870c3d5fb0e13d789d60'
  const baseId = 'appZyZ17IBOfKorr0'
  const tableName = 'Guestlist'
  const base = new Airtable({ apiKey }).base(baseId)

  async function downloadGuestlist() {
    let guests: GuestData[] = []

    let records = await base(tableName)
      .select({
        view: 'Gifty view',
      })
      .all()

    records.forEach((record) =>
      guests.push({
        firstname: record.get('First Name') as string,
        lastname: record.get('Last Name') as string,
        RFID: record.get('RFID') as string,
        company: record.get('Company') as string,
        used: (record.get('used') as boolean) ?? false,
        x: record.get('x') as number,
        y: record.get('y') as number,
        idx: record.get('idx') as number,
        stateId: record.get('stateId') as string,
      }),
    )

    console.log('Guestlist downloaded', guests.length)
    return guests
  }

  return { downloadGuestlist }
}
