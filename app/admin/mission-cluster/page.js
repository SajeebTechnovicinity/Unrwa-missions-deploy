"use client";
import TableExample from "@/app/example-table/page";
import ActionDropdown from "@/app/components/actionDropdown";
import { useEffect, useState } from "react";
import axiosClient from "@/app/axiosClient";
import Link from 'next/link';

function MissionCluster() {
    const [missionCluster, setMissionClusterList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosClient.get('mission-cluster');
                setMissionClusterList(data.result);
            } catch (error) {
                console.error('Error fetching misson-classifications:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    let tableName = "Mission Cluster";
    const headName = ["Si", "Name","Action"];
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
            {Array.isArray(missionCluster) && missionCluster.map((item, index) => (

                <tr key={index}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {index+1}
                        </p>
                        {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                        {/*    USD*/}
                        {/*</p>*/}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                            {/*<div className="flex-shrink-0 w-10 h-10">*/}
                            {/*    <img*/}
                            {/*        className="w-full h-full rounded-full"*/}
                            {/*        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"*/}
                            {/*        alt=""*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="ml-3">
                                <p className="text-gray-900 whitespace-no-wrap">
                                    {item.name}
                                </p>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                            {/*<div className="flex-shrink-0 w-10 h-10">*/}
                            {/*    <img*/}
                            {/*        className="w-full h-full rounded-full"*/}
                            {/*        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"*/}
                            {/*        alt=""*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className="ml-3">
                            <Link
                                href={{
                                    pathname: '/admin/cluster/edit',
                                    query: { id: item._id },
                                }}
                                className="px-4 py-2 mx-2 bg-green-500 text-white rounded"
                              > Edit</Link>
                                <Link
                                href={{
                                    pathname: '/admin/cluster/edit',
                                    query: { id: item._id },
                                }}
                                className="px-4 py-2 mx-2 bg-red-500 text-white rounded"
                              > Delete</Link>
                                {/*<p className="text-gray-600 whitespace-no-wrap">*/}
                                {/*    000004*/}
                                {/*</p>*/}
                            </div>
                        </div>
                    </td>
                  
                    {/* <td className="relative px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <ActionDropdown />
                    </td> */}
                </tr>
            ))}
        </>
    );


    return (
        <TableExample tableName={tableName} tableHead={head} body={body}/>
    );
}

export default MissionCluster;
