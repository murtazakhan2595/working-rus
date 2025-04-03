const EmpSheetLoader = () => {
  console.log("Loading employee sheet...");
  return (
    <tbody className="bg-white text-gray-500">
      <tr className="whitespace-nowrap border-b-2">
        <td className="px-6 py-2">
          <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-20 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-40 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        <td className="px-6 py-2">
          <div className="w-16 h-6 bg-gray-300 rounded-md animate-pulse"></div>
        </td>
        
      </tr>
    </tbody>
  );
};

export default EmpSheetLoader;
