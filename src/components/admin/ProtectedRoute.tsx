export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Authentication disabled - allow direct access
  return <>{children}</>;
}
