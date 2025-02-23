'use client'

import { AuthContext } from "@/supabase/client";
import { sortById, uppercase } from "@/utils/utils";
import { useContext, useEffect, useState, useRef } from "react";
import { revalidateAllUsers } from "@/supabase/tracking";
import { RequirementsPage } from "../../myprofile/page";

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
    'grid-cols-16'
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
]

function generateCSV(user)
{
    if (!user) return null;
    let row = 
    {
        name: user?.name,
        standing: user?.standings.name,
        class: user?.class.name
    }
    user.event_users_requirements.forEach(r =>
    {
        row[ r.name ] = r.value;   
    })
    user.credit_users_requirements.forEach(r =>
    {
        row[ r.name ] = r.value;   
    })
    return row;
}

function downloadCSV(data)
{    
    const csvContent = [
        Object.keys(data[0]).join(","),  // Headers
        ...data.map(row => Object.values(row).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);    
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

    useEffect(() => {
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
        users.forEach((user) => 
        {
            if (user[ 'service' ]) 
            {
                const val = user[ 'service' ]
                t += val
                if (user.standing == 5) pledge += val
                else active += val
            }
        })
        setServiceHourTotal(t)
        setpledgeServiceHourTotal(pledge)
        setactiveServiceHourTotal(active)
    }, [users])

    async function regenerate()
    {
        await revalidateAllUsers();
        window.location.reload()
    }

    return (
        <div className="flex flex-col items-center space-y-4 overflow-y-auto">
            <h1 className="text-center text-xl text-neutral-600">Users</h1>
            <div className="flex justify-between gap-3">
                <p className="bg-neutral-300 p-2 rounded-md text-black">Pledge Service Hour Total: { pledgeserviceHourTotal }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Active Service Hour Total: { activeserviceHourTotal }</p>
                <p className="bg-neutral-300 p-2 rounded-md text-black">Service Hour Total: { serviceHourTotal }</p>
                <button className="justify-between space-x-4 p-2 bg-red-500 rounded text-white" onClick={() => { regenerate() }}>
                    Regenerate Data (may take up to a few minutes)
                </button>
            </div>
            <div className={`grid ${grid_cols_width[creditRequirements.length + eventRequirements.length + 3]} w-full text-center`}>
                <h1 className="text-start">Name</h1>
                <h1>Email</h1>
                {/* <div className={`overflow-x-scroll grid grid-cols-subgrid ${col_span_width[creditRequirements.length + eventRequirements.length + 1]}`}> */}
                    <h1 className="text-end">Standing</h1>
                    {
                        creditRequirements.map((req, i) => {
                            return (
                                <h1 key={i} className="text-end px-2 truncate max-w-[150px]">{req.name}</h1>
                            )
                        })
                    }
                    {
                        eventRequirements.map((req, i) => {
                            return (
                                <h1 key={i} className="text-end px-2 truncate max-w-[150px]">{req.name}</h1>
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
