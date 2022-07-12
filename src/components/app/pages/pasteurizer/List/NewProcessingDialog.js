import Dialog from "../../../../ui/dialog/Dialog"
import { MdAddAlert, MdAlarm, MdArrowDropDown, MdClose, MdWarning } from "react-icons/md"
import Dropdown from "../../../../ui/dropdown/Dropdown"
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { add } from "../../../../../store/pasteurizer"
import ThemeContex from "../../../../../context/theme"
import API_HOST from "../../../../../apiCall/apiCall"


const arList = ["BAS200K08", "BAS20K08"]

const NewProcessingDialog = ({ show, setShow, animationTimeout }) => {

    const [lotto, setLotto] = useState("")
    const [selectedAr, setSelectedAr] = useState("")
    const [lottoInputError, setLottoInputError] = useState(false)
    const [arInputError, setArInputError] = useState(false)
    const dispatch = useDispatch()
    const { addNotification } = useContext(ThemeContex)

    useEffect(() => {
        if (!show) {
            setSelectedAr("")
            setLotto("")
            if (lottoInputError) {
                setLottoInputError(false)
            }
            if (arInputError) {
                setArInputError(false)
            }
        }
    }, [show, lotto])

    useEffect(() => {
        if (selectedAr && arInputError) {
            setArInputError(false)
        }
    }, [selectedAr])

    const lottoInputHandler = (e) => {
        e.preventDefault()
        setLotto(e.target.value)
        if ((e.target.value).length > 0 && lottoInputError) {
            setLottoInputError(false)
        }
    }

    const createWorkHandler = async () => {
        if (!lotto) {
            setLottoInputError(true)
        }

        if (!selectedAr) {
            setArInputError(true)
        }
        if (lotto && selectedAr) {
            setShow(false)
            try {
                const res = await fetch(`${API_HOST}/v1/pasteurizer/work`,
                    {
                        method: "POST",
                        body: JSON.stringify({ cd_lotto: lotto, cd_ar: selectedAr })
                    })
                if (res.ok) {
                    let work = await res.json()
                    dispatch(add(work))
                } else {
                    addNotification({
                        duration: 5000,
                        position: "top",
                        component: () => (
                            <div className="bg-red-200 gap-3 flex justify-center items-center border border-red-400 first:mt-4 mx-4 mt-2 px-8 py-4 text-sm rounded-3xl md:mx-auto shadow-md">
                                <MdWarning className="text-2xl text-red-500"></MdWarning>
                                <span>Errore di comunicazione con il server. Contattare l'assistenza.</span>
                            </div>
                        )
                    })
                }
            } catch (err) {
                addNotification({
                    duration: 5000,
                    position: "top",
                    component: () => (
                        <div className="bg-red-200 gap-3 flex justify-center items-center border border-red-400 first:mt-4 mx-4 mt-2 px-8 py-4 text-sm rounded-3xl md:mx-auto shadow-md">
                            <MdWarning className="text-2xl text-red-500"></MdWarning>
                            <span>Errore di comunicazione con il server. Contattare l'assistenza.</span>
                        </div>
                    )
                })
            }
        }
    }

    return <Dialog show={show} timeout={animationTimeout} className="mx-4 sm:mx-auto my-8 sm:max-w-md bg-white p-6 rounded-3xl flex flex-col gap-6 shadow-lg">
        <div className="flex justify-between items-center gap-2">
            <span className="text-lg font-medium capitalize">nuova lavorazione</span>
            <button onClick={() => { setShow(false) }} className="text-lg p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors duration-200 ease-in-out">
                <MdClose></MdClose>
            </button>
        </div>
        <div className="w-full flex flex-col gap-1">
            <label htmlFor="lotto" className="text-slate-500 uppercase text-xs">lotto</label>
            <input autoComplete="off" maxLength={20} name="lotto" onChange={lottoInputHandler} value={lotto} placeholder="inserisci nuovo lotto" id="lotto" type={"text"} className={`${lottoInputError ? "ring-red-500 placeholder:text-red-500" : "ring-slate-300"}  placeholder:text-slate-500 placeholder:capitalize text-sm ring-1 mt-1 focus:outline-none rounded-full px-4 leading-9`}></input>
            {lottoInputError && <span className="text-red-500 text-xs">il campo lotto non può essere vuoto</span>}
        </div>
        <div className="w-full flex flex-col gap-1">
            <label className="text-slate-500 uppercase text-xs">articolo</label>
            <Dropdown>
                <Dropdown.Trigger className={`${arInputError ? "ring-red-500 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200" : "ring-slate-300 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-200"} w-full transition-colors duration-200 ease-in-out flex items-center justify-between py-2 ring-1 mt-1 focus:outline-none rounded-full px-4`}>
                    <span className={`${arInputError ? "text-red-500" : "text-slate-500"} text-sm capitalize`}>{selectedAr ? selectedAr : "scegli articolo"}</span>
                    <MdArrowDropDown className={`${arInputError ? "text-red-500" : ""} text-xl`}></MdArrowDropDown>
                </Dropdown.Trigger>
                <Dropdown.Content className="p-2 border border-slate-300 mt-1 bg-white rounded-3xl w-full">
                    {arList.map((ar) => {
                        return <Dropdown.Item closeOnClick onClick={() => { setSelectedAr(ar) }} key={ar} className="capitalize py-2 px-3 text-sm rounded-3xl hover:bg-slate-100 w-full flex">
                            <div>{ar}</div>
                        </Dropdown.Item>
                    })}
                </Dropdown.Content>
            </Dropdown>
            {arInputError && <span className="text-red-500 text-xs">il campo articolo non può essere vuoto</span>}
        </div>
        <div className="flex items-center justify-end mt-2">
            <button
                onClick={createWorkHandler}
                className="bg-slate-200 hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-400 transition-colors duration-200 ease-in-out uppercase py-2 text-sm px-3 rounded-full">invia</button>
        </div>
    </Dialog>
}

export default NewProcessingDialog