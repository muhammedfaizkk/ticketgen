"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane } from "lucide-react"
import type { FlightData } from "@/app/page"

interface TicketPreviewProps {
  flightData: FlightData
}

export function TicketPreview({ flightData }: TicketPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
  }

  const getPassengerName = () => {
    const { title, firstName, lastName } = flightData.passenger
    if (!firstName && !lastName) return "PASSENGER NAME"
    return `${title} ${firstName} ${lastName}`.toUpperCase()
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Ticket Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-6 font-mono text-sm">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-lg font-bold">
              {flightData.departureDate && flightData.returnDate
                ? `${formatDate(flightData.departureDate)} - ${formatDate(flightData.returnDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
                : flightData.departureDate
                  ? `${formatDate(flightData.departureDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
                  : "FLIGHT TICKET"}
            </h2>
          </div>

          {/* Passenger Info */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">PREPARED FOR</span>
            </div>
            <div className="text-lg font-bold">{getPassengerName()}</div>
            <div className="flex justify-between text-xs">
              <span>RESERVATION CODE</span>
              <span>X25MK</span>
            </div>
          </div>

          {/* Outbound Flight */}
          {flightData.selectedFlights?.outbound && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Plane className="h-4 w-4" />
                <span className="font-semibold">DEPARTURE: {formatDate(flightData.selectedFlights.outbound.date)}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-lg">{flightData.selectedFlights.outbound.airline}</div>
                  <div className="font-bold">{flightData.selectedFlights.outbound.flightNumber}</div>
                  <div className="mt-2">
                    <div>Duration:</div>
                    <div>{flightData.selectedFlights.outbound.duration}</div>
                    <div className="mt-1">Cabin:</div>
                    <div>{flightData.selectedFlights.outbound.cabin}</div>
                    <div className="mt-1">Status:</div>
                    <div>Confirmed</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{flightData.selectedFlights.outbound.fromCode}</div>
                  <div className="text-xs">{flightData.selectedFlights.outbound.from.toUpperCase()}</div>
                  <div className="mt-2">
                    <div>Departing At:</div>
                    <div className="font-bold text-lg">{flightData.selectedFlights.outbound.departureTime}</div>
                    <div className="mt-1">Terminal:</div>
                    <div>{flightData.selectedFlights.outbound.terminal}</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{flightData.selectedFlights.outbound.toCode}</div>
                  <div className="text-xs">{flightData.selectedFlights.outbound.to.toUpperCase()}</div>
                  <div className="mt-2">
                    <div>Arriving At:</div>
                    <div className="font-bold text-lg">{flightData.selectedFlights.outbound.arrivalTime}</div>
                    <div className="mt-1">Terminal:</div>
                    <div>{flightData.selectedFlights.outbound.terminal}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t text-xs">
                <div className="flex justify-between">
                  <span>Passenger Name:</span>
                  <span>Seats:</span>
                  <span>Booking:</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{getPassengerName()}</span>
                  <span>Check-in Required</span>
                  <span>Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {/* Return Flight */}
          {flightData.selectedFlights?.return && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Plane className="h-4 w-4" />
                <span className="font-semibold">DEPARTURE: {formatDate(flightData.selectedFlights.return.date)}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-lg">{flightData.selectedFlights.return.airline}</div>
                  <div className="font-bold">{flightData.selectedFlights.return.flightNumber}</div>
                  <div className="mt-2">
                    <div>Duration:</div>
                    <div>{flightData.selectedFlights.return.duration}</div>
                    <div className="mt-1">Cabin:</div>
                    <div>{flightData.selectedFlights.return.cabin}</div>
                    <div className="mt-1">Status:</div>
                    <div>Confirmed</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{flightData.selectedFlights.return.fromCode}</div>
                  <div className="text-xs">{flightData.selectedFlights.return.from.toUpperCase()}</div>
                  <div className="mt-2">
                    <div>Departing At:</div>
                    <div className="font-bold text-lg">{flightData.selectedFlights.return.departureTime}</div>
                    <div className="mt-1">Terminal:</div>
                    <div>{flightData.selectedFlights.return.terminal}</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{flightData.selectedFlights.return.toCode}</div>
                  <div className="text-xs">{flightData.selectedFlights.return.to.toUpperCase()}</div>
                  <div className="mt-2">
                    <div>Arriving At:</div>
                    <div className="font-bold text-lg">{flightData.selectedFlights.return.arrivalTime}</div>
                    <div className="mt-1">Terminal:</div>
                    <div>{flightData.selectedFlights.return.terminal}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t text-xs">
                <div className="flex justify-between">
                  <span>Passenger Name:</span>
                  <span>Seats:</span>
                  <span>Booking:</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>{getPassengerName()}</span>
                  <span>Check-in Required</span>
                  <span>Confirmed</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!flightData.selectedFlights?.outbound && (
            <div className="text-center py-8 text-muted-foreground">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete the booking form to see your ticket preview</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
