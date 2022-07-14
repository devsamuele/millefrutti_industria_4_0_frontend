import Dialog from "../../../../ui/dialog/Dialog"

const OpcuaConnAlert = ({ show, setShow, animationTimeout }) => {
    return <Dialog show={show} timeout={animationTimeout} className="mx-4 sm:mx-auto my-8 sm:max-w-md bg-white p-6 rounded-3xl flex flex-col gap-4 shadow-lg">
        <div className="flex justify-between items-center gap-2">
            <span className="text-lg font-medium capitalize">Attenzione</span>
            {/* <button onClick={() => { setShow(false) }} className="text-lg p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors duration-200 ease-in-out">
                <MdClose></MdClose>
            </button> */}
        </div>
        <div className="w-full flex flex-col gap-1">
            <p className="text-sm">Nessusiona connessione con il pastorizzatore. Verificare che il pannello sia acceso e riprovare. Altrimenti contattare l'assistenza</p>
        </div>
        <div className="flex items-center justify-end mt-2">
            <button
                onClick={() => { setShow(false) }}
                className={"bg-slate-200 hover:bg-slate-300 active:bg-slate-400 focus:bg-slate-300 transition-colors duration-200 ease-in-out uppercase py-2 text-sm px-3 rounded-full"}>ok</button>
        </div>
    </Dialog >
}

export default OpcuaConnAlert