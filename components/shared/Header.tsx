const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
