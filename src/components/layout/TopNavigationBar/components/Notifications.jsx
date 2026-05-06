"use client";

import { useEffect, useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import SimplebarReactClient from "@/components/wrappers/SimplebarReactClient";
import { getNotifications } from "@/helpers/data";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from "react-bootstrap";

const NotificationItem = ({ title, message }) => {
  return (
    <DropdownItem className="py-3 border-bottom text-wrap">
      <div className="d-flex">
        <div className="avatar-sm me-2">
          <span className="avatar-title bg-soft-info text-info fs-20 rounded-circle">
            {title?.charAt(0)?.toUpperCase() || "N"}
          </span>
        </div>

        <div className="flex-grow-1">
          <p className="mb-0 fw-semibold">{title || "No Title"}</p>
          <p className="mb-0 text-wrap">{message || "No Message"}</p>
        </div>
      </div>
    </DropdownItem>
  );
};

const Notifications = () => {
  const { data: session } = useSession();
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // getNotifications will handle token check internally
        const data = await getNotifications(session?.accessToken);
        console.log("Fetched Notifications:", data); // 🔍 Debug
        setNotificationList(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.accessToken]);

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as="a"
        className="topbar-button position-relative content-none"
      >
        <IconifyIcon
          icon="solar:bell-bing-bold-duotone"
          className="fs-24 align-middle"
        />

        {/* 🔥 Dynamic Count */}
        <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
          {notificationList.length}
        </span>
      </DropdownToggle>

      <DropdownMenu className="py-0 dropdown-lg dropdown-menu-end">
        {/* Header */}
        <div className="p-3 border-bottom">
          <Row className="align-items-center">
            <div className="col">
              <h6 className="m-0 fs-16 fw-semibold">Notifications</h6>
            </div>
          </Row>
        </div>

        {/* Content */}
        <SimplebarReactClient style={{ maxHeight: 280 }}>
          {loading ? (
            <p className="text-center p-3">Loading...</p>
          ) : notificationList.length > 0 ? (
            notificationList.map((item, idx) => (
              <NotificationItem key={idx} {...item} />
            ))
          ) : (
            <p className="text-center p-3">No Notifications</p>
          )}
        </SimplebarReactClient>

        {/* Footer */}
        <div className="text-center py-3">
          <Link href="#" className="btn btn-primary btn-sm">
            View All Notification
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Notifications;