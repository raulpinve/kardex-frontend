const SkeletonTable = ({ rows = 5, columns = 5 }) => {
    return (
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex} className="px-3 py-2">
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px]"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };
  
  export default SkeletonTable;
  