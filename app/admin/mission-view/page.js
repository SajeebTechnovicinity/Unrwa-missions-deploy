"use client";

import { useRouter, useSearchParams } from "next/navigation";

import axiosClient from "@/app/axiosClient";
import { useEffect, useState } from "react";
import "./style.css";

function convertDateFormat(dateString, newFormat) {
    // Parse the input date string
    let parsedDate = new Date(dateString);

    // Format the date according to the new format
    let formattedDate = parsedDate.toLocaleDateString(undefined, {
        dateStyle: "medium",
    });

    return formattedDate;
}

function convertDateTimeFormat(dateString) {
    // Parse the input date string
    let parsedDate = new Date(dateString);

    // Format the date and time

    const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format
    };

    // Format the date and time
    let formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
        parsedDate
    );

    return formattedDateTime;
}

function MissionVIew() {
    const router = useRouter();
    const searchParames = useSearchParams();
    const mission_id = searchParames.get("id");
    const [mission, setMission] = useState();
    const [places, setplaces] = useState([]);
    const [vehicles, setvehicles] = useState([]);
    const options = [
        { value: "1", label: "Staff One" },
        { value: "2", label: "Staff Two" },
        { value: "3", label: "Staff Three" },
        { value: "4", label: "Staff Four" },
        { value: "5", label: "Staff Five" },
        { value: "6", label: "Staff Six" },
        { value: "7", label: "Staff Seven" },
    ];

    let dataList = {
        mission_id: mission_id,
        mission_classification_info: "",
        does_mission: "",
        unops_acu_status: "",
        unops_acu: "",
        cla: "",
        cla_decision: "",
        request_status: "",
        greenlight_recieve: "",
        admin_info_set: 1,
    };

    const [adminData, setadminData] = useState(dataList);
    const [claDataList, setClaDataList] = useState("");
    const [claList, setClaList] = useState("");
    const [requestStatusDataList, setRequestStatusDataList] = useState("");
    const [acuDataList, setAcuStatusDataList] = useState("");

    useEffect(() => {
        const fetchData3 = async () => {
            try {
                const { data } = await axiosClient.get("cla_list");
                setClaDataList(data.result);
                console.log(data.result);
            } catch (error) {
                console.error("Error fetching agencies:", error);
            }
        };

        fetchData3();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    useEffect(() => {
        const fetchData4 = async () => {
            try {
                const { data } = await axiosClient.get("request_status");
                setRequestStatusDataList(data.result);
                console.log(data.result);
            } catch (error) {
                console.error("Error fetching agencies:", error);
            }
        };

        fetchData4();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    useEffect(() => {
        const fetchData2 = async () => {
            try {
                const { data } = await axiosClient.get("acu_status");
                setAcuStatusDataList(data.result);
                console.log(data.result);
            } catch (error) {
                console.error("Error fetching agencies:", error);
            }
        };

        fetchData2();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = await mission_id;
                const url = `mission/${id}`;

                const { data } = await axiosClient.get(url);
                if (data.success) {
                    let missionData = await data.result.mission;
                    setMission(missionData);
                    setplaces(data.result.places);
                    setvehicles(data.result.vehicles);
                    setadminData((old) => ({
                        ...old,
                        request_status: missionData.request_status,
                        greenlight_recieve: missionData.greenlight_recieve,
                        unops_acu_status: missionData.unops_acu_status,
                        cla_decision: missionData.cla_decision,
                        mission_classification_info:
                            missionData.mission_classification_info,
                        does_mission: missionData.does_mission,
                        unops_acu: missionData.unops_acu,
                        cla: missionData.cla,
                    }));
                }

                console.log(data.result);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, []);

    const [downloading, setDownloading] = useState(0);
    const setdata = (e) => {
        const { name, value } = e.target;
        setadminData((old) => ({
            ...old, // Copy the previous state
            [name]: value, // Update the property with the given name
        }));
    };

    const storeDate = async () => {
        console.log(adminData);
        const response = await axiosClient.post(
            "mission-admin-update",
            adminData
        );
        if (response.data.success == true) {
            alert("success fully updated");
        }
    };

    async function downloadPdf() {
        setDownloading(1);
        let urlLink = `mission-pdf/${mission_id}`;
        const { data } = await axiosClient.get(urlLink);
        const fileName = "test.pdf"; // Name of the file in the public folder
        // Construct the URL to the file in the public folder
        const url = new URL(fileName, window.location.origin + "/");
        // Create a new anchor element
        const a = document.createElement("a");
        // Set the anchor's href attribute to the file path
        a.href = url;
        // Set the anchor's download attribute with the desired filename
        a.download = "mission.pdf";
        // Append the anchor to the body
        document.body.appendChild(a);
        // Click the anchor to trigger the download
        a.click();
        // Remove the anchor from the body
        document.body.removeChild(a);
        setDownloading(0);
    }

    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        // This forces a rerender, so the date is rendered
        // the second time but not the first
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <main>
                    <div className='container mx-auto px-4 sm:px-8'>
                        <div className='py-8'>
                            <main>
                                <div className='pdf-btn-wrap'>
                                    <button
                                        className='mt-4 px-4 py-2 mx-2 bg-main text-white rounded'
                                        onClick={downloadPdf}
                                    >
                                        Download PDF
                                    </button>

                                    {/*<PDFDownloadLink document={<MissionPDF missionId={'sdfsdfsdf'}/>}*/}
                                    {/*fileName="example.pdf">*/}
                                    {/*{({blob, url, loading, error}) =>*/}
                                    {/*loading ? 'Loading document...' : 'Download PDF'*/}
                                    {/*}*/}
                                    {/*</PDFDownloadLink>*/}
                                </div>
                                <div className='px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto'>
                                    <div className='msv-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14'>
                                        <h2>Section heading</h2>

                                        <div className='form__info-box'>
                                            <h3 className='form__info-box__title'>
                                                Mission Focal Point Contact
                                                Details
                                            </h3>
                                            <div className='form__row flex-ctr-spb'>
                                                <div className='form__col'>
                                                    <p>
                                                        <b>Name</b>
                                                    </p>
                                                    <p>
                                                        {mission &&
                                                            mission.leader.name}
                                                    </p>
                                                </div>
                                                <div className='form__col'>
                                                    <p>
                                                        <b>Satellite Phone</b>
                                                    </p>
                                                    <p>
                                                        {mission &&
                                                            mission.leader
                                                                .statelite_phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='form__row flex-ctr-spb'>
                                                <div className='form__col'>
                                                    <p>
                                                        <b>Phone</b>
                                                    </p>
                                                    <p>
                                                        {mission &&
                                                            mission.leader
                                                                .phone}
                                                    </p>
                                                </div>
                                                <div className='form__col'>
                                                    <p>
                                                        <b>Email Address</b>
                                                    </p>
                                                    <p>
                                                        {mission &&
                                                            mission.leader.user
                                                                .email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='form__row flex-ctr-spb'>
                                                <div className='form__col'>
                                                    <p>
                                                        <b>Whatsapp</b>
                                                    </p>
                                                    <p>
                                                        {mission &&
                                                            mission.leader
                                                                .whatsup_number}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='msb-meta-wrap'>
                                            <div className='msb-meta'>
                                                <div className='msb-meta__item'>
                                                    <h4 className='form__info-box__title'>
                                                        Agencies
                                                    </h4>
                                                    <ul className='meta-list'>
                                                        {mission &&
                                                            mission.agency.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }

                                                                    >
                                                                        {
                                                                            item
                                                                                .agency_id
                                                                                .name
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </div>
                                                <div className='msb-meta__item'>
                                                    <h4 className='form__info-box__title'>
                                                        Movement Date
                                                    </h4>
                                                    <p>
                                                        {mission &&
                                                            convertDateFormat(
                                                                mission.movement_date
                                                            )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='msb-meta'>
                                                <div className='msb-meta__item'>
                                                    <h4 className='form__info-box__title'>
                                                        Purpose
                                                    </h4>
                                                    <p>
                                                        {mission &&
                                                            mission.purpose}
                                                    </p>
                                                </div>
                                                <div className='msb-meta__item'>
                                                    <h4 className='form__info-box__title'>
                                                        Remarks
                                                    </h4>
                                                    <p>
                                                        {mission &&
                                                            mission.remarks}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='msv-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14'>
                                        <h2>Movement Stops</h2>
                                        {places &&
                                            places.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className='form__info-box'
                                                >
                                                    <h3 className='form__info-box__title'>
                                                        Departure
                                                    </h3>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Departure
                                                                    Time
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {convertDateTimeFormat(
                                                                    item.departure_time
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Facility
                                                                    Ownership
                                                                </b>
                                                            </p>
                                                            {item.departure_umrah_type ==
                                                            0 ? (
                                                                <p>NOT UNRAW</p>
                                                            ) : (
                                                                <p>UNRAW</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        {item.departure_umrah_type ==
                                                        1 ? (
                                                            <div className='form__col'>
                                                                <p>
                                                                    <b>
                                                                        Premise
                                                                        Type
                                                                    </b>
                                                                </p>
                                                                <p>
                                                                    {item.departure_umrah_type ==
                                                                    1
                                                                        ? item
                                                                              .departure_premise_type
                                                                              .name
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}

                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Installation
                                                                    Name
                                                                </b>
                                                            </p>
                                                            <p>
                                                                <p>
                                                                    {" "}
                                                                    {item.departure_umrah_id !=
                                                                    null
                                                                        ? item
                                                                              .departure_umrah_id
                                                                              .installation_name
                                                                        : item.departure_installation_name}
                                                                </p>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Building
                                                                    Code
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.departure_building_code
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>Longitude</b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.departure_longitude
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>Latitude</b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.departure_latitude
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <h3 className='form__info-box__title has-divider'>
                                                        Arrival
                                                    </h3>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Arrival Time
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {convertDateTimeFormat(
                                                                    item.arrival_time
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Facility
                                                                    Ownership
                                                                </b>
                                                            </p>
                                                            {item.arrival_umrah_type ==
                                                            0 ? (
                                                                <p>NOT UNRAW</p>
                                                            ) : (
                                                                <p>UNRAW</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        {item.arrival_umrah_type ==
                                                        1 ? (
                                                            <div className='form__col'>
                                                                <p>
                                                                    <b>
                                                                        Premise
                                                                        Type
                                                                    </b>
                                                                </p>
                                                                <p>
                                                                    {item.arrival_umrah_type ==
                                                                    1
                                                                        ? item
                                                                              .arrival_premise_type
                                                                              .name
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}

                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Installation
                                                                    Name
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {item.arrival_umrah_id !=
                                                                null
                                                                    ? item
                                                                          .arrival_umrah_id
                                                                          .installation_name
                                                                    : item.arrival_installation_name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Building
                                                                    Code
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.arrival_building_code
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>Longitude</b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.arrival_longitude
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>Latitude</b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.arrival_latitude
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className='msv-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14'>
                                        <h2>Vehicle and Driver Details</h2>
                                        {vehicles &&
                                            vehicles.map((item) => (
                                                <div className='form__info-box'>
                                                    <h3 className='form__info-box__title'>
                                                        Driver
                                                    </h3>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Agency Name
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.agency
                                                                        .name
                                                                }{" "}
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Driver Name
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.driver
                                                                        .name
                                                                }{" "}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <h3 className='form__info-box__title has-divider'>
                                                        Vehicle
                                                    </h3>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Vehicle
                                                                    Registration
                                                                    #
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.vehicle
                                                                        .registration_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Vehicle Type
                                                                    (Model)
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.vehicle
                                                                        .vehicle_type
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='form__row flex-ctr-spb'>
                                                        <div className='form__col'>
                                                            <p>
                                                                <b>
                                                                    Vehicle Body
                                                                    Description
                                                                </b>
                                                            </p>
                                                            <p>
                                                                {
                                                                    item.vehicle
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <h3 className='form__info-box__title has-divider'>
                                                        Staff
                                                    </h3>

                                                    <ul className='meta-list'>
                                                        {item.staff.map(
                                                            (item) => (
                                                                <li>
                                                                    {
                                                                        item
                                                                            .staff_id
                                                                            .name
                                                                    }
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            ))}
                                    </div>

                                    <div className='msv-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14'>
                                        <h2>Admin Mission Set</h2>
                                        <div className='collapsable-item__body'>
                                            <div className='collapsable-item__body-row flex-start-spb'>
                                                <div className='collapsable-item__body-col'>
                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='driver-name'
                                                            className='form__label'
                                                        >
                                                            CLA
                                                        </label>

                                                        <input
                                                            type='text'
                                                            value={
                                                                adminData.cla
                                                            }

                                                            onInput={setdata}
                                                            name='cla'
                                                            className='form__input'
                                                        />
                                                    </div>

                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='agency-name'
                                                            className='form__label'
                                                        >
                                                            UNOPS ACU Status
                                                        </label>
                                                        <div className='select-wrap'>
                                                            <select
                                                                className='appearance-none border rounded w-full py-2 px-3  text-grey-darker'
                                                                value={
                                                                    adminData.unops_acu_status
                                                                }

                                                                onChange={
                                                                    setdata
                                                                }

                                                            >
                                                                <option
                                                                    value=''
                                                                    disabled
                                                                    hidden
                                                                >
                                                                    Select ACU
                                                                    Status
                                                                </option>
                                                                {Array.isArray(
                                                                    acuDataList
                                                                ) &&
                                                                    acuDataList.map(
                                                                        (
                                                                            val
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    val.id
                                                                                }

                                                                                value={
                                                                                    val._id
                                                                                }

                                                                            >
                                                                                {
                                                                                    val.acu_status
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='agency-name'
                                                            className='form__label'
                                                        >
                                                            Mission
                                                            Classification
                                                        </label>
                                                        <div className='select-wrap'>
                                                            <select
                                                                className='form__select'
                                                                name='mission_classification_info'
                                                                id='facility'
                                                                value={
                                                                    adminData.mission_classification_info
                                                                }

                                                                onChange={
                                                                    setdata
                                                                }

                                                            >
                                                                <option value=''>
                                                                    Select
                                                                </option>
                                                                <option value='MRC'>
                                                                    MRC
                                                                </option>
                                                                <option value='MNR'>
                                                                    MNR
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='driver-name'
                                                            className='form__label'
                                                        >
                                                            Does Mission Require
                                                            a Greenlight
                                                        </label>
                                                        <select
                                                            className='form__select'
                                                            name='does_mission'
                                                            id='facility'
                                                            value={
                                                                adminData.does_mission
                                                            }

                                                            onChange={setdata}
                                                        >
                                                            <option value=''>
                                                                Select
                                                            </option>
                                                            <option value='yes'>
                                                                Yes
                                                            </option>
                                                            <option value='no'>
                                                                No
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='collapsable-item__body-col'>
                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='driver-name'
                                                            className='form__label'
                                                        >
                                                            CLA Decision
                                                        </label>
                                                        <div className='select-wrap'>
                                                            <select
                                                                className='form__select'
                                                                name='cla_decision'
                                                                id='facility'
                                                                value={
                                                                    adminData.cla_decision
                                                                }

                                                                onChange={
                                                                    setdata
                                                                }

                                                            >
                                                                <option value=''>
                                                                    Select
                                                                </option>
                                                                <option value='approved'>
                                                                    Approved
                                                                </option>
                                                                <option value='denied'>
                                                                    Denied
                                                                </option>
                                                            </select>
                                                        </div>
                                                        {/*{(checkValidation && info.driver == null) ? errorTxt: ""}*/}
                                                    </div>

                                                    {/*<div className="form__field collapsable-item__field">*/}
                                                    {/*    <label htmlFor="driver-name" className="form__label">*/}
                                                    {/*        CLA Decision*/}
                                                    {/*    </label>*/}
                                                    {/*    <div className="select-wrap">*/}
                                                    {/*        <select*/}
                                                    {/*            className="appearance-none border rounded w-full py-2 px-3  text-grey-darker"*/}
                                                    {/*            value={adminData.cla_decision}*/}
                                                    {/*            onChange={setdata}*/}

                                                    {/*        >*/}
                                                    {/*            <option value="" disabled hidden>*/}
                                                    {/*                Select CLA*/}
                                                    {/*            </option>*/}
                                                    {/*            /!*{Array.isArray(claDataList) && claDataList.map((val) => (*!/*/}
                                                    {/*            /!*    <option key={val.id} value={val._id}>*!/*/}
                                                    {/*            /!*        {val.name}*!/*/}
                                                    {/*            /!*    </option>*!/*/}
                                                    {/*            /!*))}*!/*/}

                                                    {/*            <option value="approved">Approved</option>*/}
                                                    {/*            <option value="denied">Denied</option>*/}
                                                    {/*        </select>*/}
                                                    {/*    </div>*/}
                                                    {/*    /!*{(checkValidation && info.driver == null) ? errorTxt: ""}*!/*/}
                                                    {/*</div>*/}
                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='driver-name'
                                                            className='form__label'
                                                        >
                                                            UNOPS ACU
                                                        </label>
                                                        <input
                                                            type='text'
                                                            value={
                                                                adminData.unops_acu
                                                            }

                                                            onInput={setdata}
                                                            name='unops_acu'
                                                            className='form__input'
                                                            id='dsc'
                                                        />
                                                        {/*{(checkValidation && info.driver == null) ? errorTxt: ""}*/}
                                                    </div>
                                                    {/*<div className="form__field collapsable-item__field">*/}
                                                    {/*    <label htmlFor="driver-name" className="form__label">*/}
                                                    {/*        Request Status*/}
                                                    {/*    </label>*/}
                                                    {/*    <div className="select-wrap">*/}
                                                    {/*        <select*/}
                                                    {/*            className="appearance-none border rounded w-full py-2 px-3  text-grey-darker"*/}
                                                    {/*            value={adminData.request_status}*/}
                                                    {/*            onChange={setdata}*/}
                                                    {/*        >*/}
                                                    {/*            <option value="" disabled hidden>*/}
                                                    {/*                Select Request Status*/}
                                                    {/*            </option>*/}
                                                    {/*            {Array.isArray(requestStatusDataList) && requestStatusDataList.map((val) => (*/}
                                                    {/*                <option key={val.id} value={val._id}>*/}

                                                    {/*                    {val.request_status}*/}
                                                    {/*                </option>*/}
                                                    {/*            ))}*/}
                                                    {/*        </select>*/}
                                                    {/*    </div>*/}
                                                    {/*    /!*{(checkValidation && info.driver == null) ? errorTxt: ""}*!/*/}
                                                    {/*</div>*/}

                                                    <div className='form__field collapsable-item__field'>
                                                        <label
                                                            htmlFor='driver-name'
                                                            className='form__label'
                                                        >
                                                            Request Status
                                                        </label>
                                                        <div className='select-wrap'>
                                                            <select
                                                                className='form__select'
                                                                name='request_status'
                                                                id='facility'
                                                                value={
                                                                    adminData.request_status
                                                                }

                                                                onChange={
                                                                    setdata
                                                                }

                                                            >
                                                                <option value=''>
                                                                    SELECT
                                                                </option>
                                                                <option value='request_recieved'>
                                                                    Request
                                                                    Recieved
                                                                </option>
                                                                <option value='request_submitted_cla'>
                                                                    Request
                                                                    submitted to
                                                                    CLA
                                                                </option>
                                                                <option value='mission_completed'>
                                                                    Mission
                                                                    Completed
                                                                </option>
                                                                <option value='request_cancelled_request'>
                                                                    Requestor
                                                                    Cancelled
                                                                    Request
                                                                </option>
                                                                <option value='mission_postponed'>
                                                                    Mission
                                                                    Postponed
                                                                </option>
                                                                <option value='mission_pending'>
                                                                    Mission
                                                                    Pending
                                                                </option>
                                                                <option value='mission_aborted'>
                                                                    Mission
                                                                    Aborted
                                                                </option>
                                                            </select>
                                                        </div>
                                                        {/*{(checkValidation && info.driver == null) ? errorTxt: ""}*/}
                                                    </div>

                                                    {adminData.does_mission !=
                                                    "no" ? (
                                                        <div className='form__field collapsable-item__field'>
                                                            <label
                                                                htmlFor='driver-name'
                                                                className='form__label'
                                                            >
                                                                Greenlight
                                                                Recieve
                                                            </label>
                                                            <input
                                                                type='text'
                                                                onInput={
                                                                    setdata
                                                                }

                                                                value={
                                                                    adminData.greenlight_recieve
                                                                }

                                                                name='greenlight_recieve'
                                                                className='form__input'
                                                            />
                                                            {/*{(checkValidation && info.driver == null) ? errorTxt: ""}*/}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {/*
                                                    <div className="form__field collapsable-item__field">
                                                        <label htmlFor="driver-name" className="form__label">
                                                                CLA Decision
                                                        </label>
                                                        <div className="select-wrap">
                                                            <select
                                                                className="form__select"
                                                                name="cla_decision"
                                                                id="facility"
                                                                value={adminData.cla_decision}
                                                                onChange={setdata}
                                                            >
                                                                <option value="">Select</option>
                                                                <option value="approved">Approved</option>
                                                                <option value="denied">Denied</option>
                                                            </select>
                                                        </div>

                                                    </div> */}
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    className='mt-4 px-4 py-2 mx-2 bg-main text-white rounded'
                                                    onClick={storeDate}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='msv-block bg-white shadow-md rounded px-8 pt-6 pb-8 mb-14'>
                                        <h1>Mission Debriefing Form</h1>
                                        <div className='mdf-form-body'>
                                            <div className='mdf-form-head'>
                                                <p>
                                                    Convoy composition
                                                    (Agencies):{" "}
                                                    <span>Sample Data</span>
                                                </p>
                                                <p>
                                                    Mission Locations visited
                                                    and route:{" "}
                                                    <span>Sample Data</span>
                                                </p>
                                                <p>
                                                    Date of the mission:{" "}
                                                    <span>Sample Data</span>
                                                </p>
                                                <p>
                                                    Mission Focal Point:{" "}
                                                    <span>Sample Data</span>
                                                </p>
                                            </div>
                                            <h3>
                                                A Road Assessment (few bullet
                                                points in relevant section)
                                            </h3>

                                            <div class='table-wrap'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Road Condition
                                                            </th>
                                                            <th>
                                                                Include remarks
                                                                description next
                                                                to the relevant
                                                                cell under
                                                                column ‘road
                                                                condition’{" "}
                                                                <span>
                                                                    (include
                                                                    stretch of
                                                                    the road,
                                                                    deviation,
                                                                    and
                                                                    additional
                                                                    relevant
                                                                    info)
                                                                </span>
                                                            </th>
                                                            <th>
                                                                Presence of EDs,
                                                                ERWs, and UXO
                                                                <span>
                                                                    (brief
                                                                    description
                                                                    and
                                                                    complement
                                                                    either with
                                                                    coordinates/picture/map
                                                                    in the next
                                                                    section)
                                                                </span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                A. Not Passable
                                                                <span>
                                                                    (e.g. Trucks
                                                                    and 4x4)
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                B. Very bad
                                                                condition
                                                                <span>
                                                                    (e.g
                                                                    accessible
                                                                    with 4x4 but
                                                                    extremely
                                                                    difficult.
                                                                    Not
                                                                    accessible
                                                                    by Truck)
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                C. Bad condition
                                                                <span>
                                                                    (accessible
                                                                    with 4x4
                                                                    with some
                                                                    level of
                                                                    difficulties
                                                                    and Trucks
                                                                    below XX
                                                                    tonnage)
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                D. Regular
                                                                condition
                                                                <span>
                                                                    (accessible
                                                                    by 2x4
                                                                    vehicles
                                                                    drive and
                                                                    Trucks XX
                                                                    tonnage)
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p>Please provide with maps and photographs below if possible</p>
                                            </div>

                                            <div class='table-wrap'>
                                                                        <h3>Section B
                                                                        </h3>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                            Insecurity or hostilities affecting humanitarian assistance
                                                            <span>(report observation in military operation area, presence of check points, (without coordinates, or specific incidents that impacted the mission)</span>
                                                            </th>

                                                            <th>
                                                            Humanitarian Observations
                                                            <span>(i.e notable presence of IDPs, urgent needs or gaps in response etc)</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>

                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className='input-wrap'>
                                                                    <input type='text' />
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MissionVIew;
