import CapIcon from "./icons/CapIcon"
import { TwitterIcon } from "./icons/TwitterIcon"
import Youtube from "./icons/Youtube"
import { SideBarItem } from "./SideBarItem"

export const SideBar = () => {
  return (
    <div>
        <div className="flex flex-row items-center justify-start gap-3 pl-3 pt-3 mb-5">
            <CapIcon/>
            <h1 className="text-2xl font-semibold">Second Brain</h1>
        </div>
        <div className="flex flex-col pl-4">
            <SideBarItem text="Youtube" logo={<Youtube size="lg"/>}/>
            <SideBarItem text="Twitter" logo={<TwitterIcon size="lg"/>}/>
        </div>
    </div>
  )
}
