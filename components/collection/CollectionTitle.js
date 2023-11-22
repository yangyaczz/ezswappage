const CollectionTitle = ({ children }) => {
  return (
    <h1 className="text-xl sm:text-2xl lg:text-3xl justify-self-start place-self-center col-span-full w-full flex justify-between items-center flex-wrap">
      {children}
    </h1>
  );
};

export default CollectionTitle;
