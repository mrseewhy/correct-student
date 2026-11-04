// Shared pass-through for the three dashboard areas.
//
// The role layouts (admin/students/tutors) keep every session read behind a
// Suspense boundary: the sidebar and top bar are static chrome that
// prerenders into the instant shell, and only the gated content and the
// account menu stream in per request. No dynamic access sits at a layout's
// top level, so this segment does not opt out of instant navigation
// validation (`instant = false`) or static-shell validation.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
