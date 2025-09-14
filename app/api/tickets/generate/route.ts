import { type NextRequest, NextResponse } from "next/server"

export interface TicketRecord {
  id: string
  passengerName: string
  fromCity: string
  toCity: string
  tripType: "one-way" | "round-trip"
  departureDate: string
  returnDate?: string
  createdAt: string
  reservationCode: string
  flightNumbers: string[]
}

// In-memory storage for demo (in production, use a database)
const ticketRecords: TicketRecord[] = []

function generateReservationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const flightData = await request.json()

    const flightNumbers = []
    if (flightData.selectedFlights?.outbound) {
      flightNumbers.push(flightData.selectedFlights.outbound.flightNumber)
    }
    if (flightData.selectedFlights?.return) {
      flightNumbers.push(flightData.selectedFlights.return.flightNumber)
    }

    const ticketRecord: TicketRecord = {
      id: crypto.randomUUID(),
      passengerName: `${flightData.passenger.title} ${flightData.passenger.firstName} ${flightData.passenger.lastName}`,
      fromCity: flightData.fromCity,
      toCity: flightData.toCity,
      tripType: flightData.tripType,
      departureDate: flightData.departureDate,
      returnDate: flightData.returnDate,
      createdAt: new Date().toISOString(),
      reservationCode: generateReservationCode(),
      flightNumbers,
    }

    // Store the ticket record
    ticketRecords.push(ticketRecord)

    return NextResponse.json({
      success: true,
      data: ticketRecord,
    })
  } catch (error) {
    console.error("Ticket generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate ticket" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: ticketRecords,
  })
}
