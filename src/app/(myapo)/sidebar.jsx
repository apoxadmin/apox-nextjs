const buttonClassName = "px-8 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150"

function SidebarButton({ name }) {
    return (
        <h1 className={buttonClassName}>
            {name}
        </h1>
    )
}

export default function Sidebar({ visible = true }) {
    return (
        <div className={`min-w-[180px] ${visible ? '' : 'hidden'}`}>
            <div className="flex flex-col text-neutral-500">
                <SidebarButton name="Calendar" />
                <SidebarButton name="My Status" />
                <SidebarButton name="My Family" />
                <SidebarButton name="My Class" />
                <SidebarButton name="Resources" />
                <SidebarButton name="ExComm" />
                <SidebarButton name="APOChat" />
                <SidebarButton name="Settings" />
            </div>
        </div>
    )
}
