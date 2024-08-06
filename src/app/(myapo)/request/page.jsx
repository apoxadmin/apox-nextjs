export default function RequestPage() {
    return (
        <div className="flex flex-col items-center p-10">
            <h1 className="text-xl text-neutral-700">Request an event</h1>
            <div>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="">Event type</div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                    </ul>
                </div>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Event Name
                        </span>
                    </div>
                    <input type="text" placeholder="" class="input input-bordered bg-neutral-100 h-[30px] text-base w-full max-w-xs" />
                </label>
                <h1>Event Name</h1>
                <h1>Event Location</h1>
                <h1>Event Description</h1>
                <h1>Off-campus?</h1>
            </div>
            <div>
                <h1>Date</h1>
                <h1>Starting time</h1>
                <h1>Ending time</h1>
            </div>
            <div>
                <h1>Capacity?</h1>
                <h1>Max capacity</h1>
            </div>
            <div>
                <h1>Service hours?</h1>
                <h1>Fundraising credit?</h1>
            </div>
            <div>
                <h1>Shifts?</h1>
                <h1>Create shifts</h1>
            </div>
        </div>
    )
}