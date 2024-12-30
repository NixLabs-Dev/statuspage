import Image from "next/image";
import Link from "next/link";
import SubscribeDialog from "./SubscribeDialog";

export default function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between px-4 py-2 sm:px-6 lg:px-12 w-full lg:w-2/3">
      <div className="flex-shrink-0">
        <Link href="/" className="inline-flex items-center space-x-4">
          <Image src="/logo.svg" width={30} height={30} alt="logo" />
          <span className="text-xl font-semibold">NixLabs Status</span>
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-2 hidden md:block">
        <SubscribeDialog />
      </div>
    </div>
  );
}
