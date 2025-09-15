"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plane, Search, CheckCircle } from "lucide-react"
import type { FlightData, Flight } from "@/app/page"

interface FlightBookingFormProps {
  flightData: FlightData
  setFlightData: (data: FlightData) => void
}

export function FlightBookingForm({ flightData, setFlightData }: FlightBookingFormProps) {
  const [currentStep, setCurrentStep] = useState<"booking" | "flights" | "passenger" | "complete">("booking")
  const [availableFlights, setAvailableFlights] = useState<{ outbound: Flight[]; return: Flight[] }>({
    outbound: [],
    return: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("passenger.")) {
      const passengerField = field.split(".")[1]
      setFlightData({
        ...flightData,
        passenger: {
          ...flightData.passenger,
          [passengerField]: value,
        },
      })
    } else {
      setFlightData({
        ...flightData,
        [field]: value,
      })
    }
  }

  const searchFlights = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromCity: flightData.fromCity,
          toCity: flightData.toCity,
          departureDate: flightData.departureDate,
          returnDate: flightData.returnDate,
          tripType: flightData.tripType,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setAvailableFlights(result.data)
        setCurrentStep("flights")
      } else {
        console.error("Flight search failed:", result.error)
      }
    } catch (error) {
      console.error("Error searching flights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectFlight = (type: "outbound" | "return", flight: Flight) => {
    setFlightData({
      ...flightData,
      selectedFlights: {
        ...flightData.selectedFlights,
        [type]: flight,
      },
    })
  }

  const proceedToPassenger = () => {
    setCurrentStep("passenger")
  }

  const completeBooking = async () => {
    setIsLoading(true)
    try {
      // Save the ticket record via API
      const response = await fetch("/api/tickets/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightData),
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStep("complete")
      } else {
        console.error("Ticket generation failed:", result.error)
      }
    } catch (error) {
      console.error("Error generating ticket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startNewBooking = () => {
    setFlightData({
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
      selectedFlights: undefined,
    })
    setCurrentStep("booking")
    setAvailableFlights({ outbound: [], return: [] })
  }

  if (currentStep === "booking") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Book Your Flight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trip Type */}
          <div className="space-y-3">
            <Label>Trip Type</Label>
            <RadioGroup
              value={flightData.tripType}
              onValueChange={(value) => handleInputChange("tripType", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-way" id="one-way" />
                <Label htmlFor="one-way">One-way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-trip" id="round-trip" />
                <Label htmlFor="round-trip">Round-trip</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Cities */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromCity">From City</Label>
              <Input
                id="fromCity"
                placeholder="e.g. Manchester"
                value={flightData.fromCity}
                onChange={(e) => handleInputChange("fromCity", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toCity">To City</Label>
              <Input
                id="toCity"
                placeholder="e.g. Amsterdam"
                value={flightData.toCity}
                onChange={(e) => handleInputChange("toCity", e.target.value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date</Label>
              <Input
                id="departureDate"
                type="date"
                value={flightData.departureDate}
                onChange={(e) => handleInputChange("departureDate", e.target.value)}
              />
            </div>
            {flightData.tripType === "round-trip" && (
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={flightData.returnDate}
                  onChange={(e) => handleInputChange("returnDate", e.target.value)}
                />
              </div>
            )}
          </div>

          <Button
            onClick={searchFlights}
            className="w-full"
            disabled={!flightData.fromCity || !flightData.toCity || !flightData.departureDate || isLoading}
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? "Searching..." : "Search Flights"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "flights") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Flights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Outbound Flights */}
            <div>
              <h3 className="font-semibold mb-3">Outbound Flight</h3>
              {availableFlights.outbound.map((flight, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {flight.airline} {flight.flightNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.fromCode} → {flight.toCode}
                      </p>
                      <p className="text-sm">
                        {flight.departureTime} - {flight.arrivalTime}
                      </p>
                      <p className="text-sm text-muted-foreground">Duration: {flight.duration}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => selectFlight("outbound", flight)}
                      variant={
                        flightData.selectedFlights?.outbound?.flightNumber === flight.flightNumber
                          ? "default"
                          : "outline"
                      }
                    >
                      {flightData.selectedFlights?.outbound?.flightNumber === flight.flightNumber
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Return Flights */}
            {flightData.tripType === "round-trip" && (
              <div>
                <h3 className="font-semibold mb-3">Return Flight</h3>
                {availableFlights.return.map((flight, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {flight.airline} {flight.flightNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.fromCode} → {flight.toCode}
                        </p>
                        <p className="text-sm">
                          {flight.departureTime} - {flight.arrivalTime}
                        </p>
                        <p className="text-sm text-muted-foreground">Duration: {flight.duration}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => selectFlight("return", flight)}
                        variant={
                          flightData.selectedFlights?.return?.flightNumber === flight.flightNumber
                            ? "default"
                            : "outline"
                        }
                      >
                        {flightData.selectedFlights?.return?.flightNumber === flight.flightNumber
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={proceedToPassenger}
              className="w-full"
              disabled={
                !flightData.selectedFlights?.outbound ||
                (flightData.tripType === "round-trip" && !flightData.selectedFlights?.return)
              }
            >
              Continue to Passenger Details
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === "passenger") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Passenger Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                value={flightData.passenger.title}
                onValueChange={(value) => handleInputChange("passenger.title", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr">Mr</SelectItem>
                  <SelectItem value="Ms">Ms</SelectItem>
                  <SelectItem value="Mrs">Mrs</SelectItem>
                  <SelectItem value="Dr">Dr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={flightData.passenger.firstName}
                onChange={(e) => handleInputChange("passenger.firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={flightData.passenger.lastName}
                onChange={(e) => handleInputChange("passenger.lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setCurrentStep("flights")}>
              Back to Flights
            </Button>
            <Button
              className="flex-1"
              disabled={!flightData.passenger.firstName || !flightData.passenger.lastName || isLoading}
              onClick={completeBooking}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Completing..." : "Complete Booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "complete") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Booking Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <p className="text-lg mb-2">Your flight ticket has been generated successfully!</p>
            <p className="text-muted-foreground mb-4">
              You can now print or download your ticket using the buttons in the preview panel.
            </p>
          </div>

          <Button onClick={startNewBooking} className="w-full" variant="outline">
            Create New Booking
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}