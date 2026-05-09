import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-12 w-auto",
  xl: "h-16 w-auto",
} as const;

type LogoProps = {
  size?: keyof typeof SIZES;
  className?: string;
};

export function Logo({ size = "md", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/logo-light.png"
        alt="CLEOM"
        width={120}
        height={40}
        priority
        className={cn(SIZES[size], "dark:hidden")}
      />
      <Image
        src="/brand/logo-dark.png"
        alt="CLEOM"
        width={120}
        height={40}
        priority
        className={cn(SIZES[size], "hidden dark:block")}
      />
    </span>
  );
}
