import Link from "next/link"

function Widget({ path = "/excomm", children }) {
    return (
        <Link href={path} className="p-4 bg-white rounded shadow-md">
            <h1 className="">
                {children}
            </h1>
        </Link>
    )
}

export default function ExCommDashboard() {
    return (
        <div className="grid grid-cols-4 gap-4 w-full h-full bg-neutral-100 p-4">
            <Widget path="/excomm/events">
                Events
            </Widget>
            <Widget path="/excomm/users">
                Users
            </Widget>
            <Widget path="/excomm/awardcredit">
                Award Credit
            </Widget>
            <Widget path="/excomm/admin">
                Create new accounts
            </Widget>
            <Widget path="/excomm/excommtrack">
                Tracking (Excomm)
            </Widget>
            <Widget path="/excomm/pledging">
                Pledging
            </Widget>
            <Widget path="/excomm/addtoevent">
                Add User To Event
            </Widget>
        </div>
    )
}
