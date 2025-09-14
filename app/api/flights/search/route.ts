import { type NextRequest, NextResponse } from "next/server"

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

// Static flight data
const staticFlightData = {
  airlines: ["KLM", "British Airways", "Lufthansa", "Air France"],
  routes: [
    {
      from: "Manchester",
      to: "Amsterdam",
      flights: [
        {
          flightNumber: "KL1026",
          airline: "KLM",
          departureTime: "05:55",
          arrivalTime: "08:15",
          duration: "1hr(s) 20min(s)",
          terminal: "Not Available",
          cabin: "Economy",
        },
        {
          flightNumber: "BA8234",
          airline: "British Airways",
          departureTime: "07:30",
          arrivalTime: "09:50",
          duration: "1hr(s) 20min(s)",
          terminal: "Terminal 2",
          cabin: "Economy",
        },
      ],
    },
    {
      from: "Amsterdam",
      to: "Manchester",
      flights: [
        {
          flightNumber: "KL1037",
          airline: "KLM",
          departureTime: "19:45",
          arrivalTime: "20:05",
          duration: "1hr(s) 20min(s)",
          terminal: "Not Available",
          cabin: "Economy",
        },
        {
          flightNumber: "BA8235",
          airline: "British Airways",
          departureTime: "21:15",
          arrivalTime: "21:35",
          duration: "1hr(s) 20min(s)",
          terminal: "Terminal 3",
          cabin: "Economy",
        },
      ],
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromCity, toCity, departureDate, returnDate, tripType } = body

    // Find matching routes
    const outboundRoute = staticFlightData.routes.find(
      (route) => route.from.toLowerCase() === fromCity.toLowerCase() && route.to.toLowerCase() === toCity.toLowerCase(),
    )

    const returnRoute =
      tripType === "round-trip"
        ? staticFlightData.routes.find(
            (route) =>
              route.from.toLowerCase() === toCity.toLowerCase() && route.to.toLowerCase() === fromCity.toLowerCase(),
          )
        : null

    // Generate flight objects
    const outboundFlights: Flight[] = outboundRoute
      ? outboundRoute.flights.map((flight) => ({
          ...flight,
          from: fromCity,
          to: toCity,
          fromCode: fromCity.substring(0, 3).toUpperCase(),
          toCode: toCity.substring(0, 3).toUpperCase(),
          date: departureDate,
        }))
      : [
          {
            flightNumber: "KL1026",
            airline: "KLM",
            from: fromCity,
            to: toCity,
            fromCode: fromCity.substring(0, 3).toUpperCase(),
            toCode: toCity.substring(0, 3).toUpperCase(),
            departureTime: "05:55",
            arrivalTime: "08:15",
            duration: "1hr(s) 20min(s)",
            terminal: "Not Available",
            cabin: "Economy",
            date: departureDate,
          },
        ]

    const returnFlights: Flight[] =
      returnRoute && returnDate
        ? returnRoute.flights.map((flight) => ({
            ...flight,
            from: toCity,
            to: fromCity,
            fromCode: toCity.substring(0, 3).toUpperCase(),
            toCode: fromCity.substring(0, 3).toUpperCase(),
            date: returnDate,
          }))
        : tripType === "round-trip" && returnDate
          ? [
              {
                flightNumber: "KL1037",
                airline: "KLM",
                from: toCity,
                to: fromCity,
                fromCode: toCity.substring(0, 3).toUpperCase(),
                toCode: fromCity.substring(0, 3).toUpperCase(),
                departureTime: "19:45",
                arrivalTime: "20:05",
                duration: "1hr(s) 20min(s)",
                terminal: "Not Available",
                cabin: "Economy",
                date: returnDate,
              },
            ]
          : []

    return NextResponse.json({
      success: true,
      data: {
        outbound: outboundFlights,
        return: returnFlights,
      },
    })
  } catch (error) {
    console.error("Flight search error:", error)
    return NextResponse.json({ success: false, error: "Failed to search flights" }, { status: 500 })
  }
}
