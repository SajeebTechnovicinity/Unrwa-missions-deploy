"use client";
import axiosClient from "@/app/axiosClient";
import TableExample from "@/app/example-table/page";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

function UmrahList() {
    const [umrah, setUmrahList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(10);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fetchData = async () => {
        try {
            const {data} = await axiosClient.get('umrah');
            if (data.success == true) {
                setUmrahList(data.result);
            }
        } catch (error) {
            setProductList([]);
            // console.error('Error fetching categories:', error);
        }
    };
    fetchData();

    useEffect(() => {
       
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    const indexOfLastItem = currentPage * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;
    const currentItems = umrah.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);


    let tableName = "Facilities List";
    const headName = [

        "installation_name",
        "premise_type",
        "country",
        "location_area",
        "sub_area",
        "longitude",
        "latitude",
        "building_code",
        "department",
        "ownership",
        "cls_list",
        "des",
        "status",
        "Action"
    ];
    let head = (
        <tr>
            {headName.map((item, index) => (
                <th
                    key={index}
                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                    {item}
                </th>
            ))}
        </tr>
    );

    const body = (
        <>
            {Array.isArray(umrah) ? currentItems.map((item, index) => (

                <tr key={index}>
                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {index + 1}
                        </p>
                     
                    </td> */}
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.installation_name}
                                </p>
                            </div>
                        </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.premise_type?item.premise_type.name:'-'}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.country?item.country.name:'-'}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.location_area}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.sub_area}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.longitude}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.latitude}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.building_code}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.department && item.department.name}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.ownership}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.cls_list}
                        </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {item.des}
                        </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {item.status ? (<span
                            className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Active</span>
                    </span>) : (<span
                            className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                        ></span>
                        <span className="relative">Inactive</span>
                    </span>)}

                    </td>
                    <td className="relative px-5 py-5 border-b border-gray-200 bg-white text-sm text-right" style={{whiteSpace: 'nowrap'}}>

                            <Link
                                href={{
                                    pathname: '/admin/umrah/edit',
                                    query: { id: item._id },
                                }}
                                className="px-4 py-2 mx-2 bg-main text-white rounded"
                              > Edit</Link>
                                <button
                                  onClick={async () => {
                                      // Show a confirmation alert
                                      const confirmed = window.confirm("Are you sure you want to delete?");

                                      if (confirmed) {
                                          // Make a DELETE request to your API to mark the question as deleted
                                          try {
                                            await axiosClient.delete(`umrah/${item._id}`, {
                                                  method: 'DELETE',
                                                  headers: {
                                                      'Content-Type': 'application/json',
                                                  },
                                              });
                                              Swal.fire({
                                                title: 'success',
                                                text: 'Successfully Deleted',
                                                icon: 'success',
                                                // confirmButtonText: 'Cool'
                                            })
                                          
                                              //setMessage('Delete successfully');
                                              // Remove the deleted question from the state
                                              //setData(data => data.filter(item => item._id !== val._id));
                                              fetchData();
                                          } catch (error) {
                                              console.error("Error deleting question:", error);
                                          }
                                      }
                                  }}
                                  className="px-4 py-2 mx-2 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                  Delete
                              </button>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}

                    </td>
                </tr>
            )) : ''}

            {/*Pangination*/}
            <ul className="flex justify-center my-4">
                {Array.from({ length: Math.ceil(umrah.length / perPage) }, (_, i) => (
                    <li key={i} className="mx-1">
                        <button
                            onClick={() => paginate(i + 1)}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${currentPage === i + 1 ? 'bg-blue-700' : ''}`}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );

    return (
        <TableExample tableName={tableName} tableHead={head} body={body}/>
    );
}

export default UmrahList;
