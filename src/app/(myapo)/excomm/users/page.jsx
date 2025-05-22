'use client'

import { AuthContext } from "@/supabase/client";
import { sortById, uppercase } from "@/utils/utils";
import { useContext, useEffect, useState, useRef } from "react";
import { getUserReqs } from "@/supabase/tracking";
import { RequirementsPage } from "../../myprofile/page";

// note: also need to change gridTemplateColumns in tailwind.config.js if you change this:
const grid_cols_width = [
    'grid-cols-0',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
    'grid-cols-13',
    'grid-cols-14',
    'grid-cols-15',
    'grid-cols-16',
    'grid-cols-17'
]

const col_span_width = [
    'col-span-0',
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
    'col-span-9',
    'col-span-10',
    'col-span-11',
    'col-span-12',
    'col-span-13',
    'col-span-14',
    'col-span-15',
    'col-span-16',
    'col-span-17'
]

function generateCSVRow(user) {
    if (!user) return null;
    let row = {
        name: user?.name,
        standing: user?.standings?.name,
        class: user?.class?.name
    };
    user.event_users_requirements.forEach(r => {
        row[r.name] = r.value;
    });
    user.credit_users_requirements.forEach(r => {
        row[r.name] = r.value;
    });
    return row;
}

function generateCSVData(users) {
    const rows = users.map(generateCSVRow);

    // Collect all unique headers
    const allHeaders = new Set();
    rows.forEach(row => {
        Object.keys(row).forEach(key => allHeaders.add(key));
    });

    const headers = Array.from(allHeaders);

    // Build CSV content
    const csvContent = [
        headers.join(","), // header row
        ...rows.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(",")) // data rows
    ].join("\n");

    return csvContent;
}

function downloadCSVFromUsers(users) {
    const csvContent = generateCSVData(users);

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function downloadTracker(users)
{
    downloadCSVFromUsers(users)
}

function UserRow({ user, creditRequirements, eventRequirements }) {
    const ref = useRef(null); 
    const [ modalOpen, setModalOpen ] = useState(false);
    const isPledge = user?.standing == 5;

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                ref.current.close();
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }
    }, []);

    function close() {
        ref.current.close();
        setModalOpen(false);
    }
    
    function open()
    {
        ref.current.showModal();
        setModalOpen(true);
    }

    return (
        <button className={`[&>*]:px-2 [&>*]:overflow-x-auto grid grid-cols-subgrid ${col_span_width[ creditRequirements.length + eventRequirements.length + 3 ]} gap-x-1 divide-black text-center`}
            onClick={() => { open() }}>
            <h1 className="text-start px-0 overflow-x-scroll text-nowrap">{user.name}</h1>
            <h1>{user.email}</h1>
            <h1 className="text-end">{uppercase(user.standings?.name || 'None')}</h1>
            {
                creditRequirements.map((req, i) => {
                    return (
                        <h1 key={i} className="text-end">
                            {
                                req.prefix
                            }
                            {
                                (isPledge && req.actives_only) ? '' : (user[req.name] || '0')
                            }
                        </h1>
                    )
                })
            }
            {
                eventRequirements.map((req, i) => {
                    return (
                        <h1 key={i} className="text-end">
                            {
                                (isPledge && req.actives_only) ? '' : (user[req.name] || '0')
                            }
                        </h1>
                    )
                })
            }
            <dialog ref={ref} className="modal">
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="flex flex-col space-y-4 modal-box w-auto max-w-6xl p-8 overflow-hidden">
                    {
                        modalOpen &&
                        <RequirementsPage user_id={user?.auth_id}/>
                    }
                    </div>
                </div>
            </dialog>
        </button>
    )
}

function compareName(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    }
    return 0;
}

export default function UserTable() {
    const supabase = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [creditRequirements, setCreditRequirements] = useState([]);
    const [eventRequirements, setEventRequirements] = useState([]);
    const [ eventTypes, setEventTypes ] = useState([]);
    const [ serviceHourTotal, setServiceHourTotal ] = useState(0);
    const [ activeserviceHourTotal, setactiveServiceHourTotal ] = useState(0);
    const [ pledgeserviceHourTotal, setpledgeServiceHourTotal ] = useState(0);
    const [ famService, setFamService ] = useState([]);
    const [ sortMode, setSortMode ] = useState([]);
    const [ progress, setProgress ] = useState(-1);

    async function getUsers() {
        const usersResponse = await supabase
            .from('users')
            .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
            .neq('standings.name', 'alumni');
        if (usersResponse.data) {
            let usersData = usersResponse.data;
            for (let user of usersData) {
                for (let credit of user.credit_users_requirements) {
                    user[credit.name] = credit.value;
                }
                for (let event_req of user.event_users_requirements) {
                    user[event_req.name] = event_req.value;
                }
            }
            usersData.sort(compareName);
            // console.log(usersData.filter(u => u.standing != 5).map(u => u.name).join(", "))
            setUsers(usersData);
        }
    }
    useEffect(() => {
        async function getCreditRequirements() {
            const response = await supabase
                .from('credit_requirements')
                .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setCreditRequirements(data);
            }
        }
        async function getEventRequirements() {
            const response = await supabase
                .from('event_requirements')
                .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setEventRequirements(data);
            }
        }
        async function getEventTypes() {
            const response = await supabase
            .from('event_types')
            .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setEventTypes(data);
            }
        }
        getUsers();
        getCreditRequirements();
        getEventRequirements();
        getEventTypes();
    }, []);

    useEffect(() =>
    {
        let t = 0;
        let pledge = 0;
        let active = 0;
        let f = [ 0, 0, 0 ]
        users.forEach((user) => 
        {
            if (user[ 'service' ]) 
            {
                const val = user[ 'service' ]
                t += val
                if (user.standing == 5) pledge += val
                else active += val  
                if (user.fam)
                {
                    f[ user.fam - 1 ] += val;
                }
            }
        })
        setFamService(f);
        setServiceHourTotal(t)
        setpledgeServiceHourTotal(pledge)
        setactiveServiceHourTotal(active)
    }, [ users ])
    
    function sortByField(field, a, b) {
        if (a[field] < b[field]) return -1;  // a should come before b
        if (a[field] > b[field]) return 1;   // a should come after b
        return 0;  // a and b are equal
    }    
    function setSort(field)
    {
        if (sortMode == [] || sortMode[0] != field)
        {
            setSortMode([ field, true ])
            setUsers(users.sort((a, b) => sortByField(field, a, b)));
        }
        else if (sortMode[1])
        {
            // switch to descending
            setSortMode([ field, false ]);
            setUsers(users.sort((a, b) => -sortByField(field, a, b)));
        }
        else
        {
            setSortMode([]);
            setUsers(users.sort((a, b) => sortByField("name", a, b)));
        }
    }

    async function regenerate()
    {
        setProgress(0.0);
        const ids = users.map((d) => d.id);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            await getUserReqs(id)
            setProgress((i + 1) / ids.length * 100);
        }
        getUsers();
        setTimeout(() => setProgress(-1), 2000);
    }

    return (
        <div className="flex flex-col items-center space-y-4 overflow-y-auto">
            <h1 className="text-center text-xl text-neutral-600">Users</h1>
            <div className="flex justify-between gap-3">
                <p className="bg-neutral-300 p-2 rounded-md text-black">Alpha Service Hour Total: { famService[0] }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Phi Service Hour Total: { famService[1] }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Omega Service Hour Total: { famService[2] }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Pledge Service Hour Total: { pledgeserviceHourTotal }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Service Hour Total: { serviceHourTotal }</p>
                {
                    progress == -1 ?
                        <div className="flex gap-2">
                            <button className="justify-between space-x-4 p-2 bg-red-500 rounded text-white" onClick={() => { regenerate() }}>
                                Regenerate Data (may take up to a few minutes)
                            </button>
                            <button className="justify-between space-x-4 p-2 bg-blue-500 rounded text-white" onClick={() => { downloadTracker(users) }}>
                                Download Tracker as .csv
                            </button>
                        </div>
                        :
                        <div style={{ width: "300px", textAlign: "center" }}>
                            <div style={{ width: "100%", backgroundColor: "#ddd", borderRadius: "10px", overflow: "hidden" }}>
                                <div
                                    style={{
                                        width: `${progress}%`,
                                        height: "20px",
                                        backgroundColor: "red",
                                        transition: "width 0.5s ease-in-out",
                                    }}
                                ></div>
                            </div>
                            <p>validating:</p>
                            <p>{progress.toFixed(2)}%</p>
                        </div>
                }
            </div>
            <h1>sorting by: { sortMode.length == 0 ? "none" : `${sortMode[0]} (${sortMode[1] ? "ascending" : "descending"})`}</h1>
            <div className={`grid ${grid_cols_width[creditRequirements.length + eventRequirements.length + 3]} w-full text-center`}>
                <button className="text-start" onClick={() => setSort("name")}>Name</button>
                <h1>Email</h1>
                {/* <div className={`overflow-x-scroll grid grid-cols-subgrid ${col_span_width[creditRequirements.length + eventRequirements.length + 1]}`}> */}
                    <button onClick={() => setSort("standing")} className="text-end">Standing</button>
                    {
                        creditRequirements.map((req, i) => {
                            return (
                                <button key={i} onClick={() => setSort(req.name)} className="text-end px-2 truncate max-w-[150px]">{req.name}</button>
                            )
                        })
                    }
                    {
                        eventRequirements.map((req, i) => {
                            return (
                                <button key={i} onClick={() => setSort(req.name)} className="text-end px-2 truncate max-w-[150px]">{req.name}</button>
                            )
                        })
                    }
                {/* </div> */}
            </div>
            <div className="overflow-y-scroll w-full">
                <div className={`min-w-0 max-w-none gap-y-2 gap-x-4 grid ${grid_cols_width[creditRequirements.length + eventRequirements.length + 3]}`}>
                    {
                        users.map((user, i) => {
                            return (
                                <UserRow key={i} user={user} creditRequirements={creditRequirements} eventRequirements={eventRequirements} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
