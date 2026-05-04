'use client'

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardFooter, Col, Row, Button } from "react-bootstrap"
import IconifyIcon from '@/components/wrappers/IconifyIcon'

import AddDeliveryBoyModal from "./AddDeliveryBoyModal"
import EditDeliveryBoyModal from "./EditDeliveryBoyModal"
import AssignZoneModal from "./AssignZoneModal"

export default function DeliveryBoyList() {

  const { data: session } = useSession()

  const [boys, setBoys] = useState([])
  const [zones, setZones] = useState([])

  const [openAdd, setOpenAdd] = useState(false)
  const [editBoy, setEditBoy] = useState(null)
  const [assignBoy, setAssignBoy] = useState(null)

  // ================= FETCH BOYS =================
  const fetchBoys = async () => {

    if (!session?.accessToken) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/get_delivery_boyswithzones`,
      { headers: { Authorization: session.accessToken } }
    )

    const json = await res.json()
    if (json.status === "success") setBoys(json.data)
  }

  // ================= FETCH ZONES =================
  const fetchZones = async () => {

    if (!session?.accessToken) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/zone_list`,
      { headers: { Authorization: session.accessToken } }
    )

    const json = await res.json()
    if (json.status === "success") setZones(json.data)
  }

  useEffect(() => {
    fetchBoys()
    fetchZones()
  }, [session])

  return (
    <>
      <Row>
        <Col xl={12}>
          <Card>

            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle>All Delivery Boys</CardTitle>
              <Button size="sm" onClick={() => setOpenAdd(true)}>
                + Add Delivery Boy
              </Button>
            </CardHeader>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Zones</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {boys.map(b => (
                    <tr key={b.delivery_boy_id}>
                      <td>{b.first_name}</td>
                      <td>{b.mobile_no}</td>
                      <td>{b.zone_name || "-"}</td>

                      <td>
                        <div className="d-flex gap-2">

                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => setEditBoy(b)}
                          >
                            <IconifyIcon icon="solar:pen-2-broken" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => setAssignBoy(b)}
                          >
                            Assign Zone
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CardFooter>Total: {boys.length}</CardFooter>

          </Card>
        </Col>
      </Row>

      {openAdd && (
        <AddDeliveryBoyModal
          onClose={() => {
            setOpenAdd(false)
            fetchBoys()
          }}
        />
      )}

      {editBoy && (
        <EditDeliveryBoyModal
          boy={editBoy}
          onClose={() => {
            setEditBoy(null)
            fetchBoys()
          }}
        />
      )}

      {assignBoy && (
        <AssignZoneModal
          boy={assignBoy}
          zones={zones}
          onClose={() => {
            setAssignBoy(null)
            fetchBoys()
          }}
        />
      )}
    </>
  )
}
