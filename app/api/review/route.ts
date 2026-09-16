import { NextRequest, NextResponse } from 'next/server'

const BASE_ID = 'appd1wTStPNASBYJz'
const TABLE_ID = 'tblX90yduhdD0WybR'

export async function POST(req: NextRequest) {
  const token = process.env.AIRTABLE_TOKEN
  if (!token) {
    return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 })
  }

  const { stars, comment } = await req.json()

  if (![1, 2, 3].includes(stars) || !comment || !comment.trim()) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
  }

  const fields = {
    Stars: stars,
    Comment: comment,
  }

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('Airtable error:', errText)
    return NextResponse.json({ success: false, error: 'Airtable error' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
