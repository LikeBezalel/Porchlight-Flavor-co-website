"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import OrderDetail from "./OrderDetail";

function formatDate(s: string | null) {
  if (!s) return null;
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---- Card ----
function OrderCard({
  order,
  onClick,
  isDragOverlay = false,
}: {
  order: Order;
  onClick?: () => void;
  isDragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: order.id,
    data: { order },
    disabled: isDragOverlay,
  });

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      onClick={onClick}
      className={`
        rounded-xl border bg-white px-4 py-3 cursor-pointer select-none
        hover:shadow-sm hover:border-[var(--color-gold)]/40 transition-all
        ${isDragging ? "opacity-30" : ""}
        ${isDragOverlay ? "shadow-lg rotate-1 opacity-95" : ""}
        border-[var(--color-parchment)]
      `}
    >
      <p className="text-sm font-semibold text-[var(--color-brown)] leading-snug">
        {order.name}
      </p>
      {order.interests?.length > 0 && (
        <p className="text-xs text-[var(--color-brown-muted)] mt-0.5 leading-snug">
          {order.interests.join(", ")}
        </p>
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
        {order.desired_date && (
          <span className="text-xs text-[var(--color-gold)] font-medium">
            {formatDate(order.desired_date)}
          </span>
        )}
        {order.fulfillment && (
          <span className="text-xs text-[var(--color-brown-muted)]">{order.fulfillment}</span>
        )}
        <span className="text-xs text-[var(--color-brown-muted)]/60">
          {formatDate(order.created_at)}
        </span>
      </div>
    </div>
  );
}

// ---- Column ----
function KanbanColumn({
  status,
  orders,
  onCardClick,
}: {
  status: OrderStatus;
  orders: Order[];
  onCardClick: (order: Order) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[220px] w-[220px] sm:min-w-[240px] sm:w-[240px] flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brown-muted)]">
          {STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-[var(--color-brown-muted)]/60 bg-[var(--color-cream-dark)] rounded-full px-2 py-0.5">
          {orders.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`
          flex-1 rounded-2xl p-2 min-h-[80px] space-y-2 transition-colors
          ${isOver ? "bg-[var(--color-gold-pale)] ring-2 ring-[var(--color-gold)]/40" : "bg-[var(--color-cream-dark)]"}
        `}
      >
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} onClick={() => onCardClick(o)} />
        ))}
      </div>
    </div>
  );
}

// ---- Board ----
export default function KanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const byStatus = useCallback(
    (status: OrderStatus) => orders.filter((o) => o.status === status),
    [orders]
  );

  function handleDragStart({ active }: DragStartEvent) {
    const order = orders.find((o) => o.id === active.id);
    if (order) setActiveOrder(order);
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveOrder(null);
    if (!over || active.id === over.id) return;

    const newStatus = over.id as OrderStatus;
    if (!ORDER_STATUSES.includes(newStatus)) return;

    const orderId = String(active.id);
    const prev = orders.find((o) => o.id === orderId);
    if (!prev || prev.status === newStatus) return;

    // Optimistic update
    setOrders((os) =>
      os.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      // Rollback on failure
      setOrders((os) =>
        os.map((o) => (o.id === orderId ? { ...o, status: prev.status } : o))
      );
    } else if (data) {
      setOrders((os) => os.map((o) => (o.id === orderId ? (data as Order) : o)));
      // If this card is open in the detail panel, update it too
      if (selectedOrder?.id === orderId) setSelectedOrder(data as Order);
    }
  }

  function handleOrderUpdate(updated: Order) {
    setOrders((os) => os.map((o) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Horizontal scroll container */}
        <div
          className="flex gap-4 overflow-x-auto pb-6 px-4 sm:px-6"
          data-dragging={activeOrder ? "true" : undefined}
        >
          {ORDER_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              orders={byStatus(status)}
              onCardClick={(order) => setSelectedOrder(order)}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeOrder ? (
            <OrderCard order={activeOrder} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}
    </>
  );
}
