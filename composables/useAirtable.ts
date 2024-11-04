import Airtable from 'airtable'

import type { GuestData } from '~~/types'

export default function useAirtable() {
  const apiKey =
    'patYINjjyje7bmFeN.69963b1980d0f7e130990faf1ed846b00bc4106dd846870c3d5fb0e13d789d60'
  const baseId = 'appZyZ17IBOfKorr0'
  const tableName = 'Guestlist Final'
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
        firstname: record.get('First name') as string,
        lastname: record.get('Last name') as string,
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

  async function updateGuestRFID(
    firstname: string,
    lastname: string,
    RFID: string,
  ) {
    try {
      // Escape single quotes in names to prevent errors in the formula
      function escapeAirtableFormulaValue(value: string): string {
        return value.replace(/'/g, "\\'")
      }

      const firstName = escapeAirtableFormulaValue(firstname)
      const lastName = escapeAirtableFormulaValue(lastname)

      // Build the filter formula to match both first name and last name
      const filterFormula = `AND(
        LOWER({First name}) = LOWER('${firstName}'),
        LOWER({Last name}) = LOWER('${lastName}')
      )`

      // Find the record(s) matching the first name and last name
      let records = await base(tableName)
        .select({
          filterByFormula: filterFormula,
        })
        .all()

      if (records.length === 0) {
        console.error(`Guest with name ${firstname} ${lastname} not found.`)
        return
      } else if (records.length > 1) {
        console.warn(
          `Multiple guests found with name ${firstname} ${lastname}. Updating the first one found.`,
        )
      }

      let record = records[0]
      await base(tableName).update(record.id, {
        RFID,
      })

      console.log(`Guest ${firstname} ${lastname} updated`)
    } catch (error) {
      console.error('Error updating guest RFID:', error)
      throw error
    }
  }

  return { downloadGuestlist, updateGuestRFID }
}
