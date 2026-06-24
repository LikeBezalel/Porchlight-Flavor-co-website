"use client";

import { useState, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export type DbCategory = {
  id: string;
  title: string;
  tagline: string;
  label: string | null;
  sort_order: number;
  visible: boolean;
};

export type DbMenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  visible: boolean;
};

type Props = {
  categories: DbCategory[];
  items: DbMenuItem[];
  supabaseUrl: string;
};

export default function MenuManager({ categories: initCats, items: initItems, supabaseUrl }: Props) {
  const [categories, setCategories] = useState(initCats);
  const [items, setItems] = useState(initItems);
  const [editingItem, setEditingItem] = useState<DbMenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<DbMenuItem> | null>(null);
  const [activeCategory, setActiveCategory] = useState(initCats[0]?.id ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const catItems = items.filter((i) => i.category_id === activeCategory);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    setUploading(false);
    if (error) { setError(error.message); return null; }
    return `${supabaseUrl}/storage/v1/object/public/menu-images/${path}`;
  }

  async function saveItem(item: DbMenuItem) {
    setError("");
    const { error } = await supabase
      .from("menu_items")
      .update({
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        featured: item.featured,
        visible: item.visible,
      })
      .eq("id", item.id);
    if (error) { setError(error.message); return; }
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    setEditingItem(null);
  }

  async function addItem(item: Partial<DbMenuItem>) {
    setError("");
    if (!item.name || !item.description) { setError("Name and description are required."); return; }
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        category_id: activeCategory,
        name: item.name,
        description: item.description,
        price: item.price ?? null,
        image_url: item.image_url ?? null,
        featured: item.featured ?? false,
        visible: item.visible ?? true,
        sort_order: catItems.length + 1,
      })
      .select()
      .single();
    if (error) { setError(error.message); return; }
    setItems((prev) => [...prev, data as DbMenuItem]);
    setNewItem(null);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    setError("");
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { setError(error.message); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function toggleFeatured(item: DbMenuItem) {
    const updated = { ...item, featured: !item.featured };
    const { error } = await supabase
      .from("menu_items")
      .update({ featured: updated.featured })
      .eq("id", item.id);
    if (error) { setError(error.message); return; }
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: "edit" | "new") {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    if (target === "edit" && editingItem) setEditingItem({ ...editingItem, image_url: url });
    if (target === "new") setNewItem((prev) => ({ ...prev, image_url: url }));
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setEditingItem(null); setNewItem(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-[var(--color-gold)] text-white"
                : "bg-[var(--color-cream-dark)] text-[var(--color-brown-muted)] hover:text-[var(--color-brown)]"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Item list */}
      <div className="space-y-3">
        {catItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[var(--color-parchment)] overflow-hidden"
          >
            {editingItem?.id === item.id ? (
              <ItemForm
                value={editingItem}
                onChange={setEditingItem as (v: DbMenuItem) => void}
                onSave={() => startTransition(() => { saveItem(editingItem); })}
                onCancel={() => setEditingItem(null)}
                onImageUpload={(e) => handleImageUpload(e, "edit")}
                uploading={uploading}
                isPending={isPending}
              />
            ) : (
              <div className="flex items-center gap-4 px-4 py-3">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[var(--color-cream-dark)] flex-shrink-0 flex items-center justify-center text-2xl text-[var(--color-brown)]/20 font-light" style={{ fontFamily: "var(--font-display)" }}>
                    {item.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--color-brown)]" style={{ fontFamily: "var(--font-display)" }}>
                      {item.name}
                    </span>
                    {!item.visible && (
                      <span className="text-xs bg-[var(--color-cream-dark)] text-[var(--color-brown-muted)] px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  {item.price && <p className="text-xs text-[var(--color-gold)] font-medium">{item.price}</p>}
                  <p className="text-xs text-[var(--color-brown-muted)] line-clamp-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFeatured(item)}
                    title={item.featured ? "Remove from banner" : "Add to homepage banner"}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      item.featured
                        ? "bg-[var(--color-gold)] text-white"
                        : "bg-[var(--color-cream-dark)] text-[var(--color-brown-muted)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]"
                    }`}
                  >
                    {item.featured ? "★ Featured" : "☆ Feature"}
                  </button>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-xs font-medium text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] px-3 py-1.5 rounded-full border border-[var(--color-parchment)] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 rounded-full border border-red-100 hover:border-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new item */}
      {newItem ? (
        <div className="bg-white rounded-2xl border border-[var(--color-parchment)] overflow-hidden">
          <ItemForm
            value={newItem as DbMenuItem}
            onChange={(v) => setNewItem(v)}
            onSave={() => startTransition(() => { addItem(newItem); })}
            onCancel={() => setNewItem(null)}
            onImageUpload={(e) => handleImageUpload(e, "new")}
            uploading={uploading}
            isPending={isPending}
            isNew
          />
        </div>
      ) : (
        <button
          onClick={() => setNewItem({ name: "", description: "", price: "", featured: false, visible: true })}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)] hover:text-[var(--color-brown-light)] transition-colors py-2"
        >
          <span className="text-lg leading-none">+</span> Add item to {categories.find((c) => c.id === activeCategory)?.title}
        </button>
      )}

      {/* Featured banner summary */}
      <div className="bg-[var(--color-gold-pale)] rounded-2xl p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-3">
          Homepage Banner — Featured Items
        </p>
        {items.filter((i) => i.featured).length === 0 ? (
          <p className="text-sm text-[var(--color-brown-muted)]">
            No items featured yet. Click "☆ Feature" on any item above to show it in the homepage banner.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.filter((i) => i.featured).map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 bg-white rounded-full px-3 py-1 text-sm text-[var(--color-brown)] border border-[var(--color-parchment)]"
              >
                {item.name}
                <button
                  onClick={() => toggleFeatured(item)}
                  className="text-[var(--color-brown-muted)] hover:text-red-500 transition-colors"
                  title="Remove from banner"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" />
    </div>
  );
}

type FormProps = {
  value: DbMenuItem;
  onChange: (v: DbMenuItem) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  isPending: boolean;
  isNew?: boolean;
};

function ItemForm({ value, onChange, onSave, onCancel, onImageUpload, uploading, isPending, isNew }: FormProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Name *</label>
          <input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Price</label>
          <input
            value={value.price ?? ""}
            onChange={(e) => onChange({ ...value, price: e.target.value || null })}
            placeholder="e.g. $6 each · 6 for $30"
            className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Description *</label>
        <textarea
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          rows={2}
          className="w-full border border-[var(--color-parchment)] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] text-[var(--color-brown)] resize-none"
        />
      </div>
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-brown-muted)] mb-1">Photo</label>
          <div className="flex items-center gap-3">
            {value.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
            )}
            <label className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "border-[var(--color-parchment)] hover:border-[var(--color-gold)]/40 text-[var(--color-brown-muted)]"}`}>
              {uploading ? "Uploading…" : value.image_url ? "Replace" : "Upload"}
              <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} disabled={uploading} />
            </label>
            {value.image_url && (
              <button onClick={() => onChange({ ...value, image_url: null })} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.featured}
            onChange={(e) => onChange({ ...value, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-xs font-semibold text-[var(--color-brown-muted)]">Show in homepage banner</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.visible}
            onChange={(e) => onChange({ ...value, visible: e.target.checked })}
            className="rounded"
          />
          <span className="text-xs font-semibold text-[var(--color-brown-muted)]">Visible on menu</span>
        </label>
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onSave}
          disabled={isPending || uploading}
          className="px-5 py-2 rounded-full bg-[var(--color-gold)] text-white text-sm font-semibold hover:bg-[var(--color-brown-light)] transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving…" : isNew ? "Add Item" : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-full border border-[var(--color-parchment)] text-sm font-semibold text-[var(--color-brown-muted)] hover:text-[var(--color-brown)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
