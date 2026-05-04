'use client'

import { useState } from "react"
import { Modal, Button, Form } from "react-bootstrap"
import { useSession } from "next-auth/react"

export default function AddDeliveryBoyModal({ onClose }) {

  const { data: session } = useSession()

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")

  const submit = async () => {

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/create_delivery_boy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session.accessToken
        },
        body: JSON.stringify({
          first_name: name,
          mobile_no: mobile,
          password
        })
      }
    )

    onClose()
  }

  return (
    <Modal show centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Delivery Boy</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Control
          placeholder="Name"
          className="mb-2"
          onChange={e => setName(e.target.value)}
        />

        <Form.Control
          placeholder="Mobile"
          className="mb-2"
          onChange={e => setMobile(e.target.value)}
        />

        <Form.Control
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={submit}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}
