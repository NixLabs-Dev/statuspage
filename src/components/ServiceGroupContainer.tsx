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
      <h1 className="text-xl font-semibold">{title}</h1>
      <h2 className="text-lg text-neutral-200 mb-6">{description}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
