import { AddNewCard } from "./AddNewCard";
import { CloseIcon } from "./icons/CloseIcon";
interface ModalProps {
  open: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  fetchData:()=>void
}

export const ModalAddContent = (props: ModalProps) => {
  return <div>{props.open && <div className="h-screen w-screen bg-gray-400 bg-opacity-85 fixed top-0 flex items-center justify-center">
            <div className="bg-white-600 flex flex-col gap-4 rounded-md w-72 p-4">
                <div className="flex justify-end cursor-pointer" 
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        onClick={()=>{props.open && props.close((prev)=>!prev)}}>
                <CloseIcon size="lg"/>
                </div>
                <AddNewCard close={props.close} func={props.fetchData}/>
            </div>
        </div>}</div>;
};


