import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

const BreadCrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  return (
    <nav className="text-sm text-muted-foreground mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {i > 0 && " > "}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};
export default BreadCrumbs;
