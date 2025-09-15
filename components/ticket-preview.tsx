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
            @page { size: A4; margin: 20mm; }
            @media print { body { margin: 0; padding: 0; background: white; } }
            ${getTicketStyles()}
          </style>
        </head>
        <body>
          <div class="ticket-container">
            ${generatePrintContent()}
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Flight Ticket - ${passengerName}</title>
          <meta charset="UTF-8">
          <style>
            ${getTicketStyles()}
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
          <div class="ticket-container">
            ${generatePrintContent()}
          </div>
          <div class="download-note">
            <strong>To save as PDF:</strong> Press Ctrl+P (or Cmd+P on Mac) → Choose "Save as PDF" as destination → Click Save
          </div>
        </body>
      </html>
    `

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

  const getTicketStyles = () => `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      font-weight: 700;
    }

    .ticket-container {
      width: 794px;
      height: auto;
      background-color: white;
      margin: 0 auto;
      padding: 40px 32px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header-section {
      margin-bottom: 24px;
    }

    .trip-dates {
      display: flex;
      align-items: end;
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      color: black;
      margin-bottom: 0px;
    }

    .date {
      font-weight: 700;
    }

    .arrow {
      margin: 0 8px;
      font-size: 14px;
      margin-bottom: 2px;
    }

    .trip-to {
      font-size: 12px;
      font-weight: 300;
      margin-left: 12px;
      margin-bottom: 2px;
    }

    .destination {
      font-weight: 700;
      font-size: 18px;
      margin-left: 4px;
    }

    .header-divider {
      border-bottom: 1px solid #111;
      width: 100%;
      margin-bottom: 16px;
    }

    .prepared-for {
      font-size: 16px;
      color: black;
      font-weight: 300;
      margin-bottom: 8px;
    }

    .passenger-name {
      font-weight: 600;
      font-size: 18px;
      color: black;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .reservation-code {
      font-size: 16px;
      color: black;
      font-weight: 300;
    }

    .code {
      font-size: 16px;
      font-weight: 400;
    }

    .segment-section {
      margin-bottom: 24px;
    }

    .departure-header {
      display: flex;
      align-items: center;
      border-bottom: 1px solid black;
      padding-bottom: 0px;
      margin-bottom: 8px;
    }

    .flight-icon {
      color: black;
      font-size: 36px;
      margin-right: 8px;
      transform: rotate(-90deg);
    }

    .departure-text {
      font-weight: 500;
      text-transform: uppercase;
      font-size: 16px;
      margin-right: 8px;
    }

    .departure-date {
      font-weight: 700;
    }

    .verification-note {
      font-size: 12px;
      color: #757575;
      margin-left: auto;
      font-weight: 500;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 0.80fr 1.35fr 0.80fr;
      gap: 0px;
    }

    .airline-section {
      background-color: #E6E6E8;
      padding: 16px;
      position: relative;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 30px 100%, 0 calc(100% - 30px));
    }

    .airline-name {
      font-weight: 500;
      color: black;
      text-transform: uppercase;
      font-size: 16px;
      line-height: 1.2;
    }

    .flight-number {
      font-weight: 700;
      color: black;
      font-size: 18px;
      line-height: 1.2;
      margin-bottom: 10px;
    }

    .flight-detail {
      font-size: 14px;
      color: black;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .route-section {
      display: flex;
      flex-direction: column;
      border-left: 1px solid #C1C1C3; 
      border-top: 1px solid #C1C1C3;
      border-bottom: 1px solid #C1C1C3;
      margin-left: 4px;
    }

    .route-cities {
      display: flex;
      min-height: 100px;
    }

    .city-info {
      flex: 1;
      padding: 12px 12px 4px 12px;
      border-left: 1px solid #C1C1C3;
    }

    .city-info:first-child {
      border-left: none;
    }

    .airport-code {
      font-weight: 300;
      color: black;
      font-size: 16px;
      text-transform: uppercase;
    }

    .city-name {
      font-size: 14px;
      font-weight: 300;
      color: black;
      line-height: 1.2;
    }

    .dotted-separator {
      border-top: 1px dashed #C1C1C3;
      width: 100%;
    }

    .times-section {
      display: flex;
      min-height: 120px;
    }

    .time-info {
      flex: 1;
      padding: 12px;
    }

    .time-label {
      font-weight: 300;
      color: black;
      font-size: 14px;
    }

    .time-value {
      font-weight: 300;
      color: black;
      font-size: 20px;
      margin: 4px 0;
    }

    .terminal {
      font-size: 14px;
      color: black;
      font-weight: 300;
    }

    .vertical-dotted {
      border-left: 1px dashed #C1C1C3;
      min-height: 120px;
    }

    .aircraft-section {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1px solid #C1C1C3;
      border-top: 1px solid #C1C1C3;
      border-right: 1px solid #C1C1C3;
      border-left: 1px dashed #C1C1C3;
    }

    .aircraft-info {
      margin-bottom: 8px;
    }

    .info-label {
      font-size: 14px;
      color: black;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 14px;
      color: black;
      font-weight: 400;
    }

    .passenger-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 2px;
      margin-top: 16px;
    }

    .passenger-header {
      display: contents;
    }

    .header-cell {
      background-color: #E6E6E8;
      padding: 4px;
      font-size: 12px;
      font-weight: 500;
      color: black;
    }

    .passenger-row {
      display: contents;
    }

    .passenger-cell {
      padding: 4px;
      font-size: 12px;
      font-weight: 500;
      color: black;
      text-transform: uppercase;
    }
  `

  const generatePrintContent = () => {
    const headerText = flightData.departureDate && flightData.returnDate
      ? `${formatDateShort(flightData.departureDate)} ► ${formatDateShort(flightData.returnDate)}`
      : flightData.departureDate
        ? formatDateShort(flightData.departureDate)
        : "FLIGHT TICKET"

    let content = `
      <div class="header-section">
        <div class="trip-dates">
          <span class="date">${headerText}</span>
          <span class="trip-to">TRIP TO</span>
          <span class="destination">${flightData.toCity?.toUpperCase() || 'DESTINATION'}</span>
        </div>
        <div class="header-divider"></div>
        <div class="prepared-for">PREPARED FOR</div>
        <div class="passenger-name">${getPassengerName()}</div>
        <div class="reservation-code">RESERVATION CODE: <span class="code">X25MK</span></div>
      </div>
    `

    // Outbound flight
    if (flightData.selectedFlights?.outbound) {
      const flight = flightData.selectedFlights.outbound
      content += generateFlightSegment(flight)
    }

    // Return flight
    if (flightData.selectedFlights?.return) {
      const flight = flightData.selectedFlights.return
      content += generateFlightSegment(flight)
    }

    return content
  }

  const generateFlightSegment = (flight: any) => {
    return `
      <div class="segment-section">
        <div class="departure-header">
          <span class="flight-icon">✈</span>
          <span class="departure-text">DEPARTURE: <span class="departure-date">${formatDateForHeader(flight.date)}</span></span>
          <span class="verification-note">Please verify flight times prior to departure</span>
        </div>

        <div class="main-grid">
          <div class="airline-section">
            <div class="airline-name">${flight.airline}</div>
            <div class="flight-number">${flight.flightNumber}</div>
            <div class="flight-detail">Duration:<br> ${flight.duration}</div>
            <div class="flight-detail">Cabin:<br> ${flight.cabin}</div>
            <div class="flight-detail">Status:<br> Confirmed</div>
          </div>
          
          <div class="route-section">
            <div class="route-cities">
              <div class="city-info departure">
                <div class="airport-code">${flight.fromCode}</div>
                <div class="city-name">${flight.from.toUpperCase()}</div>
              </div>
              <div class="city-info arrival">
                <div class="airport-code">${flight.toCode}</div>
                <div class="city-name">${flight.to.toUpperCase()}</div>
              </div>
            </div>
            
            <div class="dotted-separator"></div>
            
            <div class="times-section">
              <div class="time-info departure">
                <div class="time-label">Departing At:</div>
                <div class="time-value">${flight.departureTime}</div>
                <div class="terminal">Terminal:<br> ${flight.terminal}</div>
              </div>
              <div class="vertical-dotted"></div>
              <div class="time-info arrival">
                <div class="time-label">Arriving At:</div>
                <div class="time-value">${flight.arrivalTime}</div>
                <div class="terminal">Terminal:<br> ${flight.terminal}</div>
              </div>
            </div>
          </div>

          <div class="aircraft-section">
            <div class="aircraft-info">
              <div class="info-label">Aircraft:</div>
              <div class="info-value">AIRBUS</div>
            </div>
            <div class="aircraft-info">
              <div class="info-label">Distance (in miles):</div>
              <div class="info-value">Not Available</div>
            </div>
            <div class="aircraft-info">
              <div class="info-label">Stop(s):</div>
              <div class="info-value">0</div>
            </div>
            <div class="aircraft-info">
              <div class="info-label">Meals:</div>
              <div class="info-value">Not Available</div>
            </div>
          </div>
        </div>

        <div class="passenger-grid">
          <div class="passenger-header">
            <div class="header-cell">Passenger Name:</div>
            <div class="header-cell">Seats:</div>
            <div class="header-cell">Booking:</div>
          </div>
          <div class="passenger-row">
            <div class="passenger-cell">${getPassengerName()}</div>
            <div class="passenger-cell">Check-in required</div>
            <div class="passenger-cell">CONFIRMED</div>
          </div>
        </div>
      </div>
    `
  }

  const formatDateShort = (dateString: string) => {
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

  const formatDateForHeader = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
    const dateFormatted = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short"
    }).toUpperCase()
    return `${dayName} ${dateFormatted}`
  }

  const getPassengerName = () => {
    const { title, firstName, lastName } = flightData.passenger
    if (!firstName && !lastName) return "PASSENGER NAME"
    return `${title || "MR"} ${firstName || ""} ${lastName || ""}`.trim().toUpperCase()
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
                onClick={handleDownload}
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
          <div 
            className="bg-white mx-auto p-8 shadow-lg"
            style={{
              width: '794px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: '700'
            }}
          >
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-end text-lg font-semibold uppercase text-black mb-0" style={{ letterSpacing: '0.02em' }}>
                <span className="font-bold">
                  {flightData.departureDate && flightData.returnDate
                    ? `${formatDateShort(flightData.departureDate)} ► ${formatDateShort(flightData.returnDate)}`
                    : flightData.departureDate
                      ? formatDateShort(flightData.departureDate)
                      : "FLIGHT TICKET"}
                </span>
                <span className="text-xs font-light ml-3 mb-0.5">TRIP TO</span>
                <span className="font-bold text-lg ml-1">{flightData.toCity?.toUpperCase() || 'DESTINATION'}</span>
              </div>
              <div className="border-b border-black w-full mb-4"></div>
              <div className="text-base text-black font-light mb-2">PREPARED FOR</div>
              <div className="font-semibold text-lg text-black uppercase mb-4">{getPassengerName()}</div>
              <div className="text-base text-black font-light">
                RESERVATION CODE: <span className="font-normal">X25MK</span>
              </div>
            </div>

            {/* Outbound Flight */}
            {flightData.selectedFlights?.outbound && (
              <FlightSegment flight={flightData.selectedFlights.outbound} passengerName={getPassengerName()} />
            )}

            {/* Return Flight */}
            {flightData.selectedFlights?.return && (
              <FlightSegment flight={flightData.selectedFlights.return} passengerName={getPassengerName()} />
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

  function FlightSegment({ flight, passengerName }: { flight: any, passengerName: string }) {
    const formatDateForHeader = (dateString: string) => {
      if (!dateString) return ""
      const date = new Date(dateString)
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()
      const dateFormatted = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
      }).toUpperCase()
      return `${dayName} ${dateFormatted}`
    }

    return (
      <div className="mb-6">
        {/* Departure Header */}
        <div className="flex items-center border-b border-black pb-0 mb-2">
          <span className="text-4xl mr-2 transform rotate-[-90deg]">✈</span>
          <span className="font-medium uppercase text-base mr-2">
            DEPARTURE: <span className="font-bold">{formatDateForHeader(flight.date)}</span>
          </span>
          <span className="text-xs text-gray-500 ml-auto font-medium">Please verify flight times prior to departure</span>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '0.80fr 1.35fr 0.80fr', gap: 0 }}>
          {/* Airline Section */}
          <div 
            className="p-4 relative"
            style={{
              backgroundColor: '#E6E6E8',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
            }}
          >
            <div className="font-medium text-black uppercase text-base leading-tight">{flight.airline}</div>
            <div className="font-bold text-black text-lg leading-tight mb-2.5">{flight.flightNumber}</div>
            <div className="text-sm text-black font-medium mb-2">Duration:<br /> {flight.duration}</div>
            <div className="text-sm text-black font-medium mb-2">Cabin:<br /> {flight.cabin}</div>
            <div className="text-sm text-black font-medium mb-2">Status:<br /> Confirmed</div>
          </div>
          
          {/* Route Section */}
          <div 
            className="flex flex-col ml-1"
            style={{
              borderLeft: '1px solid #C1C1C3',
              borderTop: '1px solid #C1C1C3',
              borderBottom: '1px solid #C1C1C3'
            }}
          >
            {/* Route Cities */}
            <div className="flex" style={{ minHeight: '100px' }}>
              <div className="flex-1 p-3 pb-1">
                <div className="font-light text-black text-base uppercase">{flight.fromCode}</div>
                <div className="text-sm font-light text-black leading-tight">{flight.from.toUpperCase()}</div>
              </div>
              <div 
                className="flex-1 p-3 pb-1"
                style={{ borderLeft: '1px solid #C1C1C3' }}
              >
                <div className="font-light text-black text-base uppercase">{flight.toCode}</div>
                <div className="text-sm font-light text-black leading-tight">{flight.to.toUpperCase()}</div>
              </div>
            </div>
            
            {/* Dotted Separator */}
            <div style={{ borderTop: '1px dashed #C1C1C3' }}></div>
            
            {/* Times Section */}
            <div className="flex" style={{ minHeight: '120px' }}>
              <div className="flex-1 p-3">
                <div className="font-light text-black text-sm">Departing At:</div>
                <div className="font-light text-black text-xl my-1">{flight.departureTime}</div>
                <div className="text-sm text-black font-light">Terminal:<br /> {flight.terminal}</div>
              </div>
              <div style={{ borderLeft: '1px dashed #C1C1C3', minHeight: '120px' }}></div>
              <div className="flex-1 p-3">
                <div className="font-light text-black text-sm">Arriving At:</div>
                <div className="font-light text-black text-xl my-1">{flight.arrivalTime}</div>
                <div className="text-sm text-black font-light">Terminal:<br /> {flight.terminal}</div>
              </div>
            </div>
          </div>

          {/* Aircraft Section */}
          <div 
            className="p-4 flex flex-col gap-1"
            style={{
              borderBottom: '1px solid #C1C1C3',
              borderTop: '1px solid #C1C1C3',
              borderRight: '1px solid #C1C1C3',
              borderLeft: '1px dashed #C1C1C3'
            }}
          >
            <div className="mb-2">
              <div className="text-sm text-black font-medium mb-1">Aircraft:</div>
              <div className="text-sm text-black font-normal">AIRBUS</div>
            </div>
            <div className="mb-2">
              <div className="text-sm text-black font-medium mb-1">Distance (in miles):</div>
              <div className="text-sm text-black font-normal">Not Available</div>
            </div>
            <div className="mb-2">
              <div className="text-sm text-black font-medium mb-1">Stop(s):</div>
              <div className="text-sm text-black font-normal">0</div>
            </div>
            <div className="mb-2">
              <div className="text-sm text-black font-medium mb-1">Meals:</div>
              <div className="text-sm text-black font-normal">Not Available</div>
            </div>
          </div>
        </div>

        {/* Passenger Grid */}
        <div 
          className="mt-4"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr',
            gap: '2px'
          }}
        >
          <div className="p-1 text-xs font-medium text-black" style={{ backgroundColor: '#E6E6E8' }}>
            Passenger Name:
          </div>
          <div className="p-1 text-xs font-medium text-black" style={{ backgroundColor: '#E6E6E8' }}>
            Seats:
          </div>
          <div className="p-1 text-xs font-medium text-black" style={{ backgroundColor: '#E6E6E8' }}>
            Booking:
          </div>
          <div className="p-1 text-xs font-medium text-black uppercase">
            {passengerName}
          </div>
          <div className="p-1 text-xs font-medium text-black uppercase">
            Check-in required
          </div>
          <div className="p-1 text-xs font-medium text-black uppercase">
            CONFIRMED
          </div>
        </div>
      </div>
    )
  }
}