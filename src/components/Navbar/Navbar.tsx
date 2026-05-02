import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-blue-800 flex justify-center sticky top-0 z-50">
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className="no-underline">
              <p className="text-lg text-gray-300 ">Home</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
