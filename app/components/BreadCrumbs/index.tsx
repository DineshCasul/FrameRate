type Crumb = {
  label: string;
  href?: string;
};

const BreadCrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  return (
    <nav className="text-sm text-gray-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i}>
          {i > 0 && " > "}
          {crumb.href ? (
            <a href={crumb.href} className="hover:underline">
              {crumb.label}
            </a>
          ) : (
            <span className="text-gray-800">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};
export default BreadCrumbs;
