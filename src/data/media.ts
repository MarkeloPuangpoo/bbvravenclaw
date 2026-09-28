export type EditorialImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

// Approved artwork stays in the project. Changing portraits are loaded from
// Supabase Storage through published records.
export const heroArtwork = {
  src: "/hero/eagle-master-rmbg.png",
  width: 1152,
  height: 1536,
  alt: "ประติมากรรมนกอินทรีสีบรอนซ์ กางปีกบนแท่น",
} satisfies EditorialImage;
