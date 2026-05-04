'use client'

import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { useSession } from "next-auth/react"

export default function AssignZoneModal({ boy, zones, onClose }) {

  const { data: session } = useSession()

  const [zoneId, setZoneId] = useState("")

  const assign = async () => {

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/assign_delivery_boyzone`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.accessToken
        },
        body: JSON.stringify({
          delivery_boy_id: boy.delivery_boy_id,
          zone_id: zoneId
        })
      }
    )

    onClose()
  }

  return (
    <Modal show centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Zone</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <Form.Select onChange={e => setZoneId(e.target.value)}>
          <option>Select Zone</option>

          {zones.map(z => (
            <option key={z.zone_id} value={z.zone_id}>
              {z.zone_name}
            </option>
          ))}

        </Form.Select>

      </Modal.Body>

      <Modal.Footer>
        <Button onClick={assign}>Assign</Button>
      </Modal.Footer>
    </Modal>
  )
}
