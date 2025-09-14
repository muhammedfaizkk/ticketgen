"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Plane, Calendar, User, MapPin, RefreshCw } from "lucide-react"
import Link from "next/link"

interface TicketRecord {
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

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<TicketRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/tickets/generate")
      const result = await response.json()

      if (result.success) {
        setTickets(result.data)
      } else {
        console.error("Failed to fetch tickets:", result.error)
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and view all generated flight tickets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchTickets} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Plane className="h-4 w-4 mr-2" />
                Back to Generator
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{tickets.length}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Round-trip</p>
                  <p className="text-2xl font-bold">{tickets.filter((t) => t.tripType === "round-trip").length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">One-way</p>
                  <p className="text-2xl font-bold">{tickets.filter((t) => t.tripType === "one-way").length}</p>
                </div>
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">
                    {tickets.filter((t) => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
                <p className="text-muted-foreground">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No tickets generated yet</h3>
                <p className="text-muted-foreground mb-4">
                  Tickets will appear here once users generate them from the main form.
                </p>
                <Link href="/">
                  <Button>
                    <Plane className="h-4 w-4 mr-2" />
                    Generate First Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Trip Type</TableHead>
                    <TableHead>Travel Dates</TableHead>
                    <TableHead>Flights</TableHead>
                    <TableHead>Reservation</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.passengerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{ticket.fromCity}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{ticket.toCity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ticket.tripType === "round-trip" ? "default" : "secondary"}>
                          {ticket.tripType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Dep: {formatDate(ticket.departureDate)}</div>
                          {ticket.returnDate && (
                            <div className="text-muted-foreground">Ret: {formatDate(ticket.returnDate)}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {ticket.flightNumbers.map((flightNumber, index) => (
                            <div key={index} className="text-xs bg-muted px-2 py-1 rounded mb-1">
                              {flightNumber}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{ticket.reservationCode}</code>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(ticket.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
