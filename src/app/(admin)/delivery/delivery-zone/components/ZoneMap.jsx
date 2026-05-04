'use client'

import { useEffect, useState } from "react"
import { GoogleMap, LoadScript, DrawingManager, Polygon } from "@react-google-maps/api"
import { useSession } from "next-auth/react"

const center = { lat: 23.0225, lng: 72.5714 }

export default function ZoneMap() {

  const { data: session } = useSession()

  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // --------------------------------
  // FETCH ZONE LIST
  // --------------------------------
  const fetchZones = async () => {

    if (!session?.accessToken) return

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/zone_list`,
        {
          headers: {
            Authorization: session.accessToken
          }
        }
      )

      const data = await res.json()

      if (data.status === "success") {

        // Parse polygon JSON
        const parsedZones = data.data.map(z => ({
          ...z,
          polygon: typeof z.polygon === "string"
            ? JSON.parse(z.polygon)
            : z.polygon
        }))

        setZones(parsedZones)
      }

    } catch (e) {
      console.log("ZONE FETCH ERROR =>", e)
    }

  }

  useEffect(() => {
    fetchZones()
  }, [session])

  // --------------------------------
  // CREATE NEW ZONE
  // --------------------------------
  const onPolygonComplete = async (polygon) => {

    if (!session?.accessToken) {
      alert("Unauthorized")
      return
    }

    const path = polygon
      .getPath()
      .getArray()
      .map(p => ({
        lat: p.lat(),
        lng: p.lng()
      }))

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/create_zone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.accessToken
        },
        body: JSON.stringify({
          zone_name: `Zone-${Date.now()}`,
          polygon: path
        })
      }
    )

    const data = await res.json()

    if (data.status === "success") {
      fetchZones() // refresh list
    }
  }

  // --------------------------------
  // DELETE ZONE
  // --------------------------------
  const deleteZone = async (zoneId) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) {
      return
    }

    if (!session?.accessToken) {
      setError("Unauthorized")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_zone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.accessToken
          },
          body: JSON.stringify({
            zone_id: zoneId
          })
        }
      )

      const data = await res.json()

      if (data.status === "success") {
        setSuccess("Zone deleted successfully!")
        setTimeout(() => {
          setSuccess(null)
        }, 3000)
        fetchZones() // refresh list
      } else {
        setError(data.msg || "Failed to delete zone")
      }
    } catch (e) {
      console.log("ZONE DELETE ERROR =>", e)
      setError("Error deleting zone")
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------
  return (
    <div className="space-y-6">
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* MAP */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}
          libraries={["drawing"]}
        >
          <GoogleMap
            zoom={13}
            center={center}
            mapContainerStyle={{ height: "600px", width: "100%" }}
          >

            {/* DRAW EXISTING ZONES */}
            {zones.map((zone, index) => (
              <Polygon
                key={index}
                paths={zone.polygon}
                options={{
                  fillColor: "#00AAFF",
                  fillOpacity: 0.3,
                  strokeColor: "#0077FF",
                  strokeWeight: 2
                }}
              />
            ))}

            {/* DRAW NEW ZONE */}
            <DrawingManager
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  drawingModes: ["polygon"]
                }
              }}
              onPolygonComplete={onPolygonComplete}
            />

          </GoogleMap>
        </LoadScript>
      </div>

      {/* ZONES LIST */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Delivery Zones ({zones.length})</h3>
        </div>
        
        {zones.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No zones created yet. Draw a polygon on the map to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Zone Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Coordinates</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, index) => (
                  <tr key={zone.zone_id || index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">{zone.zone_name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {zone.polygon?.length || 0} points
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => deleteZone(zone.zone_id)}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
