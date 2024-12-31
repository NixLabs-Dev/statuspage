export default function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative my-2 max-w-fit">
      {/* Text */}
      <h1 className={`text-3xl font-bold relative z-10 ${className}`}>
        {children}
      </h1>

      {/* Horizontal Rule */}
      <div className="absolute top-full mt-1 w-[calc(100%+2rem)] h-[1px] bg-neutral-700"></div>
    </div>
  );
}
