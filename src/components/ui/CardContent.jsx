export function CardContent({ className, ...props }) {
  return <div className={cn("space-y-2", className)} {...props} />;
}
