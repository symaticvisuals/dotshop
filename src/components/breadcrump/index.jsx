import React from "react";
import { useLocation } from "react-router-dom";

function BreadCrump() {
  const location = useLocation();
  const [path, setPath] = React.useState([]);
  React.useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    setPath(
      pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        // check if the name contains - and replace it with space
        name = name.replace(/-/g, " ");
        const id = pathnames[index + 1];
        return {
          name,
          routeTo,
          id,
        };
      })
    );
  }, [location]);

  return (
    <ol
      className="flex items-center whitespace-nowrap min-w-0 font-sans"
      aria-label="Breadcrumb">
      {
        // loop through the path array and render the breadcrumb and check if the path is the last one
        path.map((item, index) => {
          return (
            <>
              {
                // if the path is the last one then render the text
                index === path.length - 1 ? (
                  <li
                    className="font-semibold text-gray-800 truncate capitalize text-md"
                    aria-current="page">
                    {item.name}
                  </li>
                ) : (
                  // if the path is not the last one then render the link
                  <li className="text-md text-gray-600 ">
                    <a
                      className="flex items-center hover:text-blue-600 capitalize"
                      href={item.routeTo}>
                      {item.name}
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-gray-400 "
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true">
                        <path
                          d="M6 13L10 3"
                          stroke="currentColor"
                          stroke-linecap="round"
                        />
                      </svg>
                    </a>
                  </li>
                )
              }
            </>
          );
        })
      }
    </ol>
  );
}

export default BreadCrump;
