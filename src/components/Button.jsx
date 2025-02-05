export function Button({ onClick, children, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-gray-900 text-white transition duration-200 hover:border-blue-500 active:outline active:outline-4 active:outline-gray-400 ${className}`}
      >
        {children}
      </button>
    );
  }