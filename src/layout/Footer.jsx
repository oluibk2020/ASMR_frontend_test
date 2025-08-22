function Footer() {
  return (
    <footer className="bg-black h-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-bold text-white">Project App</p>

        <p className="text-sm text-gray-400">
          {" "}
          Copyright &copy; {new Date().getFullYear()} Project App. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
