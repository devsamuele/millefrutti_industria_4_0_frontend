import { useContext, useEffect, useState } from "react"
import { MdAdd, MdTaskAlt } from "react-icons/md"
import Page from "../../../Page"
import NewProcessingDialog from "./NewProcessingDialog"
import DetailProcessingDialog from "./DetailProcessingDialog"
import { useDispatch, useSelector } from "react-redux"
import { set, update, updateMany } from "../../../../../store/pasteurizer"
import WebsocketContex from "../../../../../context/websocket"
import ThemeContex from "../../../../../context/theme"
import WorkInProcessAlert from "./WorkInProcessAlert"
import API_HOST from "../../../../../apiCall/apiCall"

const animationTimeout = .2

const Home = () => {

    const [showNewProcessingDialog, setShowNewProcessingDialog] = useState(false)
    const [showDetailProcessingDialog, setShowDetailProcessingDialog] = useState(false)
    const [showWorkInProcessAlert, setShowWorkInProcessAlert] = useState(false)
    // const [loader, setLoader] = useState(false)
    // const { addNotification } = useContext(LayoutContex)
    const { currentBreakpoint } = useContext(ThemeContex)
    const { websocket } = useContext(WebsocketContex)
    const [currentWork, setCurrentWork] = useState()

    const dispatch = useDispatch()

    useEffect(() => {
        websocket.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.event === "pasteurizer-status-change") {
                dispatch(update(msg.data))
            }
            if (msg.event === "pasteurizer-created-documents") {
                console.log(msg.data)
                dispatch(updateMany(msg.data))
            }
        }

        const getWorks = async () => {
            try {
                const res = await fetch(`${API_HOST}/v1/pasteurizer/work`,
                    {
                        method: "GET",
                    })
                if (res.ok) {
                    let works = await res.json()
                    dispatch(set(works))
                }
            }
            catch (err) {

            }
        }
        getWorks()
    }, [dispatch, websocket])

    const getDate = (jsonDate) => {
        const d = new Date(jsonDate)
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }

    const getStatus = (status) => {
        switch (status) {
            case "sent":
                return "inviato"
            case "work":
                return "in lavorazione"
            case "error":
                return "in error"
            case "done":
                return "concluso"
            default:
                return ""
        }
    }

    const statusClassName = (status) => {
        switch (status) {
            case "sent":
                return "bg-blue-100 text-blue-600"
            case "work":
                return "bg-yellow-100 text-yellow-700"
            case "error":
                return "bg-red-100 text-red-500"
            case "done":
                return "bg-green-100 text-green-600"
            default:
                return ""
        }
    }

    const addButtonHandler = () => {
        const doneWork = pasteurizerList.filter((work) => {
            return work.status !== 'done'
        })
        if (doneWork.length > 0) {
            setShowWorkInProcessAlert(true)
        } else {
            setShowNewProcessingDialog(true)
        }
    }

    const pasteurizerList = useSelector((state) => {
        return state.pasteurizer.list
    })

    return <Page>
        <NewProcessingDialog show={showNewProcessingDialog} setShow={setShowNewProcessingDialog} animationTimeout={animationTimeout} />
        <DetailProcessingDialog show={showDetailProcessingDialog} setShow={setShowDetailProcessingDialog} animationTimeout={animationTimeout} work={currentWork} />
        <WorkInProcessAlert show={showWorkInProcessAlert} setShow={setShowWorkInProcessAlert} animationTimeout={animationTimeout} />
        <Page.Content>
            <div className="flex items-center p-4 max-w-[800px] m-auto flex-wrap">
                <div className="flex items-center justify-between w-full">
                    <span className="text-xl">Lavorazioni</span>
                    <button onClick={addButtonHandler} className="flex bg-slate-200 items-center justify-center text-xl p-2 hover:bg-slate-300 active:bg-slate-400 transition-colors ease-in duration-150 rounded-full">
                        <MdAdd></MdAdd>
                    </button>
                </div>
                {pasteurizerList.length > 0 &&
                    <ul className="mt-6 border rounded-3xl border-slate-300 w-full overflow-hidden">
                        {pasteurizerList.map((work) => {
                            return <li key={work?.cd_lotto} onClick={() => { setCurrentWork(work); setShowDetailProcessingDialog(true) }} className="flex items-center justify-between border-b border-slate-300 last:border-none p-4 hover:bg-slate-50 transition-colors duration-200 ease-in-out hover:cursor-pointer">
                                <div className={`${currentBreakpoint !== "sm" ? "w-1/3 px-2" : ""} flex flex-col justify-center`}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-sm">Lotto: {work?.cd_lotto}</span>
                                    </span>
                                    <span className="uppercase flex items-center gap-2 text-slate-400">
                                        <span className="text-sm">{getDate(work?.date)}</span>
                                    </span>
                                </div>
                                <div className={`${currentBreakpoint !== "sm" ? "w-1/3 px-2" : ""} ${work?.document_created ? "justify-center" : "justify-end"} flex`}>
                                    <div className={`${statusClassName(work?.status)} flex px-3 py-1 bg-slate-200 rounded-full justify-center`}>
                                        <span className="text-sm capitalize">{currentBreakpoint !== "sm" ? "stato:" : ""} {getStatus(work?.status)}</span>
                                    </div>
                                </div>
                                {currentBreakpoint !== "sm" && work?.document_created &&
                                    <span className="flex items-center justify-end gap-2 w-1/3">
                                        <MdTaskAlt className="text-xl text-green-500"></MdTaskAlt>
                                        <span className="text-sm capitalize">Documento creato</span>
                                    </span>
                                }
                            </li>
                        })}
                    </ul>}
            </div>

        </Page.Content >
    </Page >
}

export default Home