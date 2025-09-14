"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FlightBookingForm } from "@/components/flight-booking-form"
import { TicketPreview } from "@/components/ticket-preview"
import { Settings } from "lucide-react"
import Link from "next/link"

export interface FlightData {
  tripType: "one-way" | "round-trip"
  fromCity: string
  toCity: string
  departureDate: string
  returnDate?: string
  passenger: {
    title: string
    firstName: string
    lastName: string
  }
  selectedFlights?: {
    outbound?: Flight
    return?: Flight
  }
}

export interface Flight {
  flightNumber: string
  airline: string
  from: string
  to: string
  fromCode: string
  toCode: string
  departureTime: string
  arrivalTime: string
  duration: string
  terminal: string
  cabin: string
  date: string
}

export default function Home() {
  const [flightData, setFlightData] = useState<FlightData>({
    tripType: "round-trip",
    fromCity: "",
    toCity: "",
    departureDate: "",
    returnDate: "",
    passenger: {
      title: "Mr",
      firstName: "",
      lastName: "",
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">Flight Ticket Generator</h1>
            <p className="text-muted-foreground">Create professional flight tickets instantly</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Booking Form */}
          <div className="space-y-6">
            <FlightBookingForm flightData={flightData} setFlightData={setFlightData} />
          </div>

          {/* Right Side - Ticket Preview */}
          <div className="lg:sticky lg:top-8">
            <TicketPreview flightData={flightData} />
          </div>
        </div>
      </div>
    </div>
  )
}
