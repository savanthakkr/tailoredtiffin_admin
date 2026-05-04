'use client'

import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { useSession } from "next-auth/react"

export default function EditDeliveryBoyModal({ boy, onClose }) {

  const { data: session } = useSession()

  const [name, setName] = useState(boy.first_name)

  const submit = async () => {

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_delivery_boy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.accessToken
        },
        body: JSON.stringify({
          delivery_boy_id: boy.delivery_boy_id,
          first_name: name
        })
      }
    )

    onClose()
  }

  return (
    <Modal show centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Delivery Boy</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Control
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={submit}>Update</Button>
      </Modal.Footer>
    </Modal>
  )
}
