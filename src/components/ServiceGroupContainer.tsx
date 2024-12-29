export type ServiceGroupProps = {
  title: string;
  description?: string;
  status?: "UP" | "DEGRADED" | "DOWN";
  children?: React.ReactNode;
};

export default function ServiceGroupContainer({
  title,
  description,
  children,
}: ServiceGroupProps) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">{title}</h1>
      <h2 className="text-lg font-semibold mb-4">{description}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
