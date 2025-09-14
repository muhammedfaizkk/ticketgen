import type { FlightData } from "@/app/page"

export async function generateTicketPDF(flightData: FlightData) {
  // Import jsPDF dynamically to avoid SSR issues
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Set font
  doc.setFont("helvetica")

  // Helper functions
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
    return `${title} ${firstName} ${lastName}`.toUpperCase()
  }

  // Page setup
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let yPosition = 30

  // Header
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  const headerText =
    flightData.departureDate && flightData.returnDate
      ? `${formatDate(flightData.departureDate)} - ${formatDate(flightData.returnDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
      : flightData.departureDate
        ? `${formatDate(flightData.departureDate)} TRIP TO ${flightData.toCity.toUpperCase()}`
        : "FLIGHT TICKET"

  doc.text(headerText, pageWidth / 2, yPosition, { align: "center" })

  // Line under header
  yPosition += 10
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15

  // Passenger info
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("PREPARED FOR", margin, yPosition)
  yPosition += 8

  doc.setFontSize(14)
  doc.text(getPassengerName(), margin, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("RESERVATION CODE", margin, yPosition)
  doc.text("X25MK", pageWidth - margin - 20, yPosition)
  yPosition += 15

  // Outbound flight
  if (flightData.selectedFlights?.outbound) {
    const flight = flightData.selectedFlights.outbound

    // Flight header
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`✈ DEPARTURE: ${formatDate(flight.date)}`, margin, yPosition)
    yPosition += 12

    // Flight details in columns
    const col1X = margin
    const col2X = margin + 60
    const col3X = margin + 120

    // Column 1 - Airline info
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.airline, col1X, yPosition)
    doc.setFontSize(12)
    doc.text(flight.flightNumber, col1X, yPosition + 6)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Duration:", col1X, yPosition + 15)
    doc.text(flight.duration, col1X, yPosition + 20)
    doc.text("Cabin:", col1X, yPosition + 28)
    doc.text(flight.cabin, col1X, yPosition + 33)
    doc.text("Status:", col1X, yPosition + 41)
    doc.text("Confirmed", col1X, yPosition + 46)

    // Column 2 - Departure
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(flight.fromCode, col2X, yPosition)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(flight.from.toUpperCase(), col2X, yPosition + 6)

    doc.text("Departing At:", col2X, yPosition + 15)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.departureTime, col2X, yPosition + 22)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Terminal:", col2X, yPosition + 30)
    doc.text(flight.terminal, col2X, yPosition + 35)

    // Column 3 - Arrival
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(flight.toCode, col3X, yPosition)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(flight.to.toUpperCase(), col3X, yPosition + 6)

    doc.text("Arriving At:", col3X, yPosition + 15)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.arrivalTime, col3X, yPosition + 22)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Terminal:", col3X, yPosition + 30)
    doc.text(flight.terminal, col3X, yPosition + 35)

    yPosition += 55

    // Passenger details for this flight
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8

    doc.setFontSize(9)
    doc.text("Passenger Name:", margin, yPosition)
    doc.text("Seats:", margin + 60, yPosition)
    doc.text("Booking:", margin + 120, yPosition)
    yPosition += 6

    doc.setFont("helvetica", "bold")
    doc.text(getPassengerName(), margin, yPosition)
    doc.text("Check-in Required", margin + 60, yPosition)
    doc.text("Confirmed", margin + 120, yPosition)
    yPosition += 20
  }

  // Return flight
  if (flightData.selectedFlights?.return) {
    const flight = flightData.selectedFlights.return

    // Flight header
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`✈ DEPARTURE: ${formatDate(flight.date)}`, margin, yPosition)
    yPosition += 12

    // Flight details in columns (same structure as outbound)
    const col1X = margin
    const col2X = margin + 60
    const col3X = margin + 120

    // Column 1 - Airline info
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.airline, col1X, yPosition)
    doc.setFontSize(12)
    doc.text(flight.flightNumber, col1X, yPosition + 6)

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Duration:", col1X, yPosition + 15)
    doc.text(flight.duration, col1X, yPosition + 20)
    doc.text("Cabin:", col1X, yPosition + 28)
    doc.text(flight.cabin, col1X, yPosition + 33)
    doc.text("Status:", col1X, yPosition + 41)
    doc.text("Confirmed", col1X, yPosition + 46)

    // Column 2 - Departure
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(flight.fromCode, col2X, yPosition)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(flight.from.toUpperCase(), col2X, yPosition + 6)

    doc.text("Departing At:", col2X, yPosition + 15)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.departureTime, col2X, yPosition + 22)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Terminal:", col2X, yPosition + 30)
    doc.text(flight.terminal, col2X, yPosition + 35)

    // Column 3 - Arrival
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(flight.toCode, col3X, yPosition)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(flight.to.toUpperCase(), col3X, yPosition + 6)

    doc.text("Arriving At:", col3X, yPosition + 15)
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text(flight.arrivalTime, col3X, yPosition + 22)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text("Terminal:", col3X, yPosition + 30)
    doc.text(flight.terminal, col3X, yPosition + 35)

    yPosition += 55

    // Passenger details for return flight
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8

    doc.setFontSize(9)
    doc.text("Passenger Name:", margin, yPosition)
    doc.text("Seats:", margin + 60, yPosition)
    doc.text("Booking:", margin + 120, yPosition)
    yPosition += 6

    doc.setFont("helvetica", "bold")
    doc.text(getPassengerName(), margin, yPosition)
    doc.text("Check-in Required", margin + 60, yPosition)
    doc.text("Confirmed", margin + 120, yPosition)
  }

  // Generate filename
  const passengerLastName = flightData.passenger.lastName || "Passenger"
  const destination = flightData.toCity || "Destination"
  const filename = `Flight_Ticket_${passengerLastName}_${destination}.pdf`

  // Save the PDF
  doc.save(filename)
}
