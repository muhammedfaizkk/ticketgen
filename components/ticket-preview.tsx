"use client"

import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Download, Printer } from "lucide-react"
import type { FlightData } from "@/app/page"

interface TicketPreviewProps {
  flightData: FlightData
}

export function TicketPreview({ flightData }: TicketPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    const passengerName = getPassengerName()
    const destination = flightData.toCity || "Destination"

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flight Ticket - ${passengerName}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Courier New', monospace;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 0;
              line-height: 1.4;
            }
            .ticket {
              border: 2px solid #000;
              padding: 20px;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .passenger-section {
              margin-bottom: 20px;
            }
            .passenger-name {
              font-size: 16px;
              font-weight: bold;
              margin: 8px 0;
            }
            .reservation {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 10px 0;
            }
            .flight-section {
              border-top: 1px solid #000;
              padding-top: 15px;
              margin: 20px 0;
            }
            .flight-header {
              font-weight: bold;
              margin-bottom: 15px;
              font-size: 14px;
            }
            .flight-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              font-size: 12px;
            }
            .airline {
              font-size: 16px;
              font-weight: bold;
            }
            .flight-number {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .airport-code {
              font-weight: bold;
              font-size: 14px;
            }
            .city-name {
              font-size: 10px;
              text-transform: uppercase;
            }
            .time {
              font-size: 16px;
              font-weight: bold;
              margin: 5px 0;
            }
            .detail-row {
              margin: 3px 0;
            }
            .passenger-details {
              border-top: 1px solid #ccc;
              padding-top: 10px;
              margin-top: 15px;
              font-size: 12px;
            }
            .passenger-grid {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .passenger-grid.bold {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            ${generatePrintContent()}
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    // Print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  const handleDownload = () => {
    const printContent = printRef.current
    if (!printContent) return

    const passengerName = getPassengerName()
    const destination = flightData.toCity || "Destination"
    const fileName = `Flight_Ticket_${flightData.passenger.lastName || "Passenger"}_${destination}.html`

    // Create HTML content for download
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flight Ticket - ${passengerName}</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            @media print {
              body { margin: 0; }
            }
            body {
              font-family: 'Courier New', monospace;
              color: #000;
              background: #fff;
              margin: 20px;
              padding: 0;
              line-height: 1.4;
            }
            .ticket {
              border: 2px solid #000;
              padding: 20px;
              background: white;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .passenger-section {
              margin-bottom: 20px;
            }
            .passenger-name {
              font-size: 16px;
              font-weight: bold;
              margin: 8px 0;
            }
            .reservation {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin: 10px 0;
            }
            .flight-section {
              border-top: 1px solid #000;
              padding-top: 15px;
              margin: 20px 0;
            }
            .flight-header {
              font-weight: bold;
              margin-bottom: 15px;
              font-size: 14px;
            }
            .flight-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 20px;
              font-size: 12px;
            }
            .airline {
              font-size: 16px;
              font-weight: bold;
            }
            .flight-number {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .airport-code {
              font-weight: bold;
              font-size: 14px;
            }
            .city-name {
              font-size: 10px;
              text-transform: uppercase;
            }
            .time {
              font-size: 16px;
              font-weight: bold;
              margin: 5px 0;
            }
            .detail-row {
              margin: 3px 0;
            }
            .passenger-details {
              border-top: 1px solid #ccc;
              padding-top: 10px;
              margin-top: 15px;
              font-size: 12px;
            }
            .passenger-grid {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .passenger-grid.bold {
              font-weight: bold;
            }
            .download-note {
              margin-top: 30px;
              padding: 15px;
              background: #f5f5f5;
              border: 1px solid #ddd;
              border-radius: 5px;
              font-size: 12px;
            }
            @media print {
              .download-note { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            ${generatePrintContent()}
          </div>
          <div class="download-note">
            <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac) → Choose "Save as PDF" as destination → Click Save
          </div>
        </body>
      </html>
    `

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const generatePrintContent = () => {
    const headerText = flightData.departureDate && flightData.returnDate
      ? `${formatDate(flightData.departureDate)} - ${formatDate(flightData.returnDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
      : flightData.departureDate
        ? `${formatDate(flightData.departureDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
        : "FLIGHT TICKET"

    let content = `
      <div class="header">
        <h1>${headerText}</h1>
      </div>
      
      <div class="passenger-section">
        <div style="font-weight: bold;">PREPARED FOR</div>
        <div class="passenger-name">${getPassengerName()}</div>
        <div class="reservation">
          <span>RESERVATION CODE</span>
          <span>X25MK</span>
        </div>
      </div>
    `

    // Outbound flight
    if (flightData.selectedFlights?.outbound) {
      const flight = flightData.selectedFlights.outbound
      content += `
        <div class="flight-section">
          <div class="flight-header">✈ DEPARTURE: ${formatDate(flight.date)}</div>
          <div class="flight-grid">
            <div>
              <div class="airline">${flight.airline}</div>
              <div class="flight-number">${flight.flightNumber}</div>
              <div class="detail-row">Duration:</div>
              <div class="detail-row">${flight.duration}</div>
              <div class="detail-row">Cabin:</div>
              <div class="detail-row">${flight.cabin}</div>
              <div class="detail-row">Status:</div>
              <div class="detail-row">Confirmed</div>
            </div>
            <div>
              <div class="airport-code">${flight.fromCode}</div>
              <div class="city-name">${flight.from.toUpperCase()}</div>
              <div class="detail-row">Departing At:</div>
              <div class="time">${flight.departureTime}</div>
              <div class="detail-row">Terminal:</div>
              <div class="detail-row">${flight.terminal}</div>
            </div>
            <div>
              <div class="airport-code">${flight.toCode}</div>
              <div class="city-name">${flight.to.toUpperCase()}</div>
              <div class="detail-row">Arriving At:</div>
              <div class="time">${flight.arrivalTime}</div>
              <div class="detail-row">Terminal:</div>
              <div class="detail-row">${flight.terminal}</div>
            </div>
          </div>
          <div class="passenger-details">
            <div class="passenger-grid">
              <span>Passenger Name:</span>
              <span>Seats:</span>
              <span>Booking:</span>
            </div>
            <div class="passenger-grid bold">
              <span>${getPassengerName()}</span>
              <span>Check-in Required</span>
              <span>Confirmed</span>
            </div>
          </div>
        </div>
      `
    }

    // Return flight
    if (flightData.selectedFlights?.return) {
      const flight = flightData.selectedFlights.return
      content += `
        <div class="flight-section">
          <div class="flight-header">✈ DEPARTURE: ${formatDate(flight.date)}</div>
          <div class="flight-grid">
            <div>
              <div class="airline">${flight.airline}</div>
              <div class="flight-number">${flight.flightNumber}</div>
              <div class="detail-row">Duration:</div>
              <div class="detail-row">${flight.duration}</div>
              <div class="detail-row">Cabin:</div>
              <div class="detail-row">${flight.cabin}</div>
              <div class="detail-row">Status:</div>
              <div class="detail-row">Confirmed</div>
            </div>
            <div>
              <div class="airport-code">${flight.fromCode}</div>
              <div class="city-name">${flight.from.toUpperCase()}</div>
              <div class="detail-row">Departing At:</div>
              <div class="time">${flight.departureTime}</div>
              <div class="detail-row">Terminal:</div>
              <div class="detail-row">${flight.terminal}</div>
            </div>
            <div>
              <div class="airport-code">${flight.toCode}</div>
              <div class="city-name">${flight.to.toUpperCase()}</div>
              <div class="detail-row">Arriving At:</div>
              <div class="time">${flight.arrivalTime}</div>
              <div class="detail-row">Terminal:</div>
              <div class="detail-row">${flight.terminal}</div>
            </div>
          </div>
          <div class="passenger-details">
            <div class="passenger-grid">
              <span>Passenger Name:</span>
              <span>Seats:</span>
              <span>Booking:</span>
            </div>
            <div class="passenger-grid bold">
              <span>${getPassengerName()}</span>
              <span>Check-in Required</span>
              <span>Confirmed</span>
            </div>
          </div>
        </div>
      `
    }

    return content
  }

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

  const hasFlightData = flightData.selectedFlights?.outbound

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Ticket Preview
          </div>
          {hasFlightData && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={printRef}>
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
        </div>
      </CardContent>
    </Card>
  )
}