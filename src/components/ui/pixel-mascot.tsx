import Image from "next/image";

type PixelMascotVariant =
  | "forging"
  | "analyzing"
  | "waving"
  | "trophy"
  | "warning"
  | "sharing";

type PixelMascotProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: PixelMascotVariant;
  className?: string;
  priority?: boolean;
};

const sizeMap = {
  xs: 40,
  sm: 56,
  md: 80,
  lg: 120,
  xl: 160,
};

const variantMap: Record<PixelMascotVariant, { src: string; alt: string }> = {
  forging: {
    src: "/mascot/smith-forging-brain.png",
    alt: "Smith forging a brain",
  },
  analyzing: {
    src: "/mascot/smith-analyzing.png",
    alt: "Smith analyzing a brain",
  },
  waving: {
    src: "/mascot/smith-waving.png",
    alt: "Smith waving hello",
  },
  trophy: {
    src: "/mascot/smith-trophy.png",
    alt: "Smith holding a trophy",
  },
  warning: {
    src: "/mascot/smith-warning.png",
    alt: "Smith holding a warning sign",
  },
  sharing: {
    src: "/mascot/smith-sharing.png",
    alt: "Smith holding a sharing card",
  },
};

export function PixelMascot({
  size = "md",
  variant = "analyzing",
  className,
  priority = false,
}: PixelMascotProps) {
  const dimension = sizeMap[size];
  const asset = variantMap[variant];

  return (
    <Image
      alt={asset.alt}
      className={className}
      height={dimension}
      priority={priority}
      src={asset.src}
      unoptimized
      width={dimension}
    />
  );
}
