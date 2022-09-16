import { Fragment, useContext, useEffect, useState } from "react";
import { MdAdd, MdTaskAlt, MdWarning } from "react-icons/md";
import Page from "../../../Page";
import NewProcessingDialog from "./NewProcessingDialog";
import DetailProcessingDialog from "./DetailProcessingDialog";
import WorkInProcessAlert from "./WorkInProcessAlert";
import { RiLoader4Fill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux";
import {
    set,
    update,
    updateMany,
    updateOpcuaConn,
} from "../../../../../store/spindryer";
import WebsocketContex from "../../../../../context/websocket";
import ThemeContex from "../../../../../context/theme";
import API_HOST from "../../../../../apiCall/apiCall";
import OpcuaConnAlert from "./OpcuaConnAlert";

const animationTimeout = 0.2;

const Home = () => {
    const [showNewProcessingDialog, setShowNewProcessingDialog] = useState(false);
    const [showDetailProcessingDialog, setShowDetailProcessingDialog] = useState(false);
    const [showWorkInProcessAlert, setShowWorkInProcessAlert] = useState(false);
    const [showOpcuaConnAlert, setShowOpcuaConnAlert] = useState(false);
    const [loader, setLoader] = useState(false)
    // const [loader, setLoader] = useState(false)
    // const { addNotification } = useContext(LayoutContex)
    const { currentBreakpoint } = useContext(ThemeContex);
    const { websocket, ready } = useContext(WebsocketContex);
    const [currentWork, setCurrentWork] = useState();

    const { addNotification } = useContext(ThemeContex)

    // const [serverError, setServerError] = useState(false)

    const dispatch = useDispatch();


    useEffect(() => {
        if (ready) {
            websocket.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.event === "spindryer-status-change") {
                    dispatch(update(msg.data));
                }
                if (msg.event === "spindryer-created-documents") {
                    dispatch(updateMany(msg.data));
                }
                if (msg.event === "spindryer-client-closed") {
                    if (!opcuaConn.connected) {
                        dispatch(updateOpcuaConn({ connected: false }));
                    }
                }
            };

            const getOpcuaConn = async () => {
                try {
                    const res = await fetch(
                        `${API_HOST}/v1/spindryer/opcuaConnection`,
                        {
                            method: "GET",
                        }
                    );
                    if (res.ok) {
                        let conn = await res.json();
                        dispatch(updateOpcuaConn(conn));
                        // if (serverError) {
                        //     setServerError(false)
                        // }
                    }
                } catch (err) {
                    // setServerError(true)
                }
            };
            getOpcuaConn();

            const getWorks = async () => {
                try {
                    const res = await fetch(`${API_HOST}/v1/spindryer/work`, {
                        method: "GET",
                    });
                    if (res.ok) {
                        let works = await res.json();
                        dispatch(set(works));
                        // if (serverError) {
                        //     setServerError(false)
                        // }
                    }
                } catch (err) {
                    // setServerError(true)
                }
            };
            getWorks();
        }
    }, [ready]);

    const connectOpcua = async () => {
        setLoader(true)
        try {
            const res = await fetch(`${API_HOST}/v1/spindryer/opcuaConnect`, {
                method: "POST",
            });
            if (res.ok) {
                dispatch(updateOpcuaConn({ connected: true }));
                setLoader(false)
                // if (serverError) {
                //     setServerError(false)
                // }
            } else {
                addNotification({
                    duration: 5000,
                    position: "top",
                    component: () => (
                        <div className="bg-red-200 gap-3 flex justify-center items-center border border-red-400 first:mt-4 mx-4 mt-2 px-8 py-4 text-sm rounded-3xl md:mx-auto shadow-md">
                            <MdWarning className="text-2xl text-red-500"></MdWarning>
                            <span>Impossibile connettersi alla centrifuga. Verificare che il pannello sia attivo.</span>
                        </div>
                    )
                })
            }
        } catch (err) {
            // setServerError(true)
        }
    };

    const disconnectOpcua = async () => {
        setLoader(true)
        try {
            const res = await fetch(`${API_HOST}/v1/spindryer/opcuaDisconnect`, {
                method: "POST",
            });
            if (res.ok) {
                dispatch(updateOpcuaConn({ connected: false }));
                setLoader(false)
                // if (serverError) {
                //     setServerError(false)
                // }
            }
        } catch (err) {
            // setServerError(true)
        }
    };

    const getDate = (jsonDate) => {
        const d = new Date(jsonDate);
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    };

    const getStatus = (status) => {
        switch (status) {
            case "sent":
                return "inviato";
            case "work":
                return "in lavorazione";
            case "error":
                return "in error";
            case "done":
                return "concluso";
            default:
                return "";
        }
    };

    const statusClassName = (status) => {
        switch (status) {
            case "sent":
                return "bg-blue-100 text-blue-600";
            case "work":
                return "bg-yellow-100 text-yellow-700";
            case "error":
                return "bg-red-100 text-red-500";
            case "done":
                return "bg-green-100 text-green-600";
            default:
                return "";
        }
    };

    const addWorkHandler = () => {
        const doneWork = spindryerList.filter((work) => {
            return work.status !== "done";
        });

        if (!opcuaConn.connected) {
            setShowOpcuaConnAlert(true)
        } else {
            if (doneWork.length > 0) {
                setShowWorkInProcessAlert(true);
            } else {
                setShowNewProcessingDialog(true);
            }
        }
    };

    const spindryerList = useSelector((state) => {
        return state.spindryer.list;
    });

    const opcuaConn = useSelector((state) => {
        return state.spindryer.opcuaConn;
    });


    return (
        <Page>
            <NewProcessingDialog
                show={showNewProcessingDialog}
                setShow={setShowNewProcessingDialog}
                animationTimeout={animationTimeout}
            />
            <DetailProcessingDialog
                show={showDetailProcessingDialog}
                setShow={setShowDetailProcessingDialog}
                opcuaConn={opcuaConn.connected}
                animationTimeout={animationTimeout}
                work={currentWork}
            />
            <WorkInProcessAlert
                show={showWorkInProcessAlert}
                setShow={setShowWorkInProcessAlert}
                animationTimeout={animationTimeout}
            />
            <OpcuaConnAlert
                show={showOpcuaConnAlert}
                setShow={setShowOpcuaConnAlert}
                animationTimeout={animationTimeout}
            ></OpcuaConnAlert>
            <Page.Content>
                <div className="flex flex-col justify-center gap-4 p-4 max-w-[800px] m-auto flex-wrap">
                    {ready !== null && !ready ? <div className="flex justify-center bg-red-100 text-red-500 rounded-3xl px-2 py-6">
                        <div>Il server web non è in funzione. contattare l'assistenza</div>
                    </div> : ''}
                    <Fragment>
                        <div className="flex items-center justify-between gap-3 border-b pb-4">
                            <div className="flex gap-3 font-medium uppercase items-center justify-between">
                                Centrifuga {
                                    opcuaConn.connected && ready ?
                                        <span className="flex p-1.5 bg-green-500 rounded-full"></span> :
                                        <span className="flex p-1.5 bg-red-500 rounded-full"></span>}
                            </div>
                            <div>
                                {opcuaConn.connected && ready ?
                                    <button disabled={loader || !ready} onClick={disconnectOpcua} className={`${loader || !ready ? '' : 'hover:bg-slate-300 active:bg-slate-400'} flex gap-2 bg-slate-200 items-center justify-center px-3 py-1.5 transition-colors ease-in duration-150 rounded-full`} >
                                        {loader ?
                                            <RiLoader4Fill className="animate-spin text-2xl text-gray-500"></RiLoader4Fill> : ''
                                        }
                                        Disconnetti</button> :
                                    <button disabled={loader || !ready} onClick={connectOpcua} className={`${loader || !ready ? '' : 'hover:bg-slate-300 active:bg-slate-400'} flex gap-2 bg-slate-200 items-center justify-center px-3 py-1.5 transition-colors ease-in duration-150 rounded-full`} >
                                        {loader ?
                                            <RiLoader4Fill className="animate-spin text-2xl text-gray-500"></RiLoader4Fill> : ''
                                        }
                                        Connetti</button>}
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <span className="text-xl">Lavorazioni</span>
                            <button
                                disabled={loader || !ready}
                                onClick={addWorkHandler}
                                className={`${opcuaConn.connected ? 'hover:bg-slate-300 active:bg-slate-400' : ''} flex bg-slate-200 items-center justify-center text-xl p-2 transition-colors ease-in duration-150 rounded-full`}
                            >
                                <MdAdd></MdAdd>
                            </button>
                        </div>
                        {spindryerList.length > 0 && (
                            <ul className="border rounded-3xl border-slate-300 w-full overflow-hidden">
                                {spindryerList.map((work) => {
                                    return (
                                        <li
                                            key={work?.cd_lotto}
                                            onClick={() => {
                                                setCurrentWork(work);
                                                setShowDetailProcessingDialog(true)
                                            }}
                                            className="flex items-center justify-between border-b border-slate-300 last:border-none p-4 hover:bg-slate-50 transition-colors duration-200 ease-in-out hover:cursor-pointer"
                                        >
                                            <div
                                                className={`${currentBreakpoint !== "sm"
                                                    ? "w-1/3 px-2"
                                                    : ""
                                                    } flex flex-col justify-center`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span className="text-sm">
                                                        Lotto: {work?.cd_lotto}
                                                    </span>
                                                </span>
                                                <span className="uppercase flex items-center gap-2 text-slate-400">
                                                    <span className="text-sm">
                                                        {getDate(work?.date)}
                                                    </span>
                                                </span>
                                            </div>
                                            <div
                                                className={`${currentBreakpoint !== "sm"
                                                    ? "w-1/3 px-2"
                                                    : ""
                                                    } ${work?.document_created
                                                        ? "justify-center"
                                                        : "justify-end"
                                                    } flex`}
                                            >
                                                <div
                                                    className={`${statusClassName(
                                                        work?.status
                                                    )} flex px-3 py-1 bg-slate-200 rounded-full justify-center`}
                                                >
                                                    <span className="text-sm capitalize">
                                                        {currentBreakpoint !== "sm"
                                                            ? "stato:"
                                                            : ""}{" "}
                                                        {getStatus(work?.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            {currentBreakpoint !== "sm" &&
                                                work?.document_created && (
                                                    <span className="flex items-center justify-end gap-2 w-1/3">
                                                        <MdTaskAlt className="text-xl text-green-500"></MdTaskAlt>
                                                        <span className="text-sm capitalize">
                                                            Documento creato
                                                        </span>
                                                    </span>
                                                )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Fragment>
                </div>
            </Page.Content >
        </Page >
    );
};

export default Home;
