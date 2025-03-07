import { ReactElement } from "react"

interface ItemInterface{
  logo:ReactElement;
  text:string
}

export const SideBarItem = (props:ItemInterface) => {
  return (
    <div className="flex flex-row items-center justify-start gap-4 p-2 m-4 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300"
    >
      {props.logo}
      <span className="text-lg font-semibold text-gray-800">{props.text}</span>
    </div>
  )
}
