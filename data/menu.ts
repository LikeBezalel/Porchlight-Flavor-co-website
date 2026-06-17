export type MenuItem = {
  name: string;
  description: string;
  price?: string;
  image?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  tagline: string;
  label?: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "premium-muffins",
    title: "Premium Muffins",
    tagline:
      "Baked from scratch in small batches, our muffins bring together fresh flavors, tender crumb, and the warmth of home in every bite.",
    label: "6-count minimum · $4.50 each",
    items: [
      {
        name: "Blueberry Morning Crumble",
        description: "Plump blueberries, buttery crumb topping baked to a golden crunch.",
      },
      {
        name: "Sunshine Lemon Poppy",
        description:
          "Lemon zest and poppy seeds, moist and buttery, delicate lemon glaze.",
      },
      {
        name: "Chocolate Hearth",
        description:
          "Deep chocolate, tender bakery crumb, loaded with chocolate chips.",
      },
    ],
  },
  {
    id: "porch-slice",
    title: "Porch Slice",
    tagline:
      "Signature triple-layer cake slices baked from scratch and layered with silky frosting or rich ganache. A little celebration in every bite.",
    items: [
      {
        name: "Midnight Chocolate",
        description:
          "Black cocoa cake, chocolate ganache, chocolate sprinkles.",
        price: "$6/slice · $27 for 5",
      },
      {
        name: "Garden Gate Carrot Cake",
        description:
          "Pineapple, carrots, walnuts, cream cheese frosting.",
        price: "$6.50/slice · $30 for 5",
      },
      {
        name: "Honeysuckle White",
        description: "Soft white/vanilla cake, vanilla buttercream.",
        price: "$6/slice · $27 for 5",
      },
    ],
  },
  {
    id: "bread-box",
    title: "The Bread Box",
    tagline: "Each available as: $4 slice · $5 mini loaf · $10 whole large loaf.",
    items: [
      {
        name: "Rocking Chair Banana Bread",
        description: "Soft banana bread packed with pecans, baked golden.",
      },
      {
        name: "Fresh Squeezed Lemon Loaf",
        description:
          "Moist lemon loaf, fresh juice and zest, lemon glaze.",
      },
    ],
  },
  {
    id: "little-treats",
    title: "Little Porch Light Treats",
    tagline: "Sweet little things worth every bite.",
    items: [
      {
        name: "Front Porch Fudge Brownie",
        description:
          "Large fudge brownie, chocolate chips, dense chewy center.",
        price: "$5 each",
      },
      {
        name: "Campfire Crispies",
        description:
          "Oversized crispy treats, buttery marshmallow, extra marshmallow on top.",
        price: "$4 each",
      },
      {
        name: "Fresh Baked Porch Cookies",
        description: "Oversized chocolate chip, crisp edges, chewy center.",
        price: "$3.50 each · 12 for $40",
      },
    ],
  },
];
