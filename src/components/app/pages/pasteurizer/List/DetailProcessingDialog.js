import Dialog from "../../../../ui/dialog/Dialog";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import Dropdown from "../../../../ui/dropdown/Dropdown";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { remove } from "../../../../../store/pasteurizer";
import API_HOST from "../../../../../apiCall/apiCall";

const DetailProcessingDialog = ({ show, setShow, animationTimeout, work, opcuaConn }) => {
    const dispatch = useDispatch();

    const deleteWorkHandler = async () => {
        setShow(false);
        // start loader
        const res = await fetch(`${API_HOST}/v1/pasteurizer/work/${work.id}`, {
            method: "DELETE",
            body: JSON.stringify({
                cd_lotto: work.cd_lotto,
                cd_ar: work.cd_ar,
            }),
        });
        if (res.ok) {
            dispatch(remove(work.id));
        }
        // stop loader
    };

    return (
        <Dialog
            show={show}
            timeout={animationTimeout}
            className="mx-4 sm:mx-auto my-8 sm:max-w-md bg-white p-6 rounded-3xl flex flex-col gap-6 shadow-lg"
        >
            <div className="flex justify-between items-center gap-2">
                <span className="text-lg font-medium capitalize">
                    dettaglio lavorazione
                </span>
                <button
                    onClick={() => {
                        setShow(false);
                    }}
                    className="text-lg p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors duration-200 ease-in-out"
                >
                    <MdClose></MdClose>
                </button>
            </div>
            <div className="w-full flex flex-col gap-1">
                <label
                    htmlFor="lotto"
                    className="text-slate-500 uppercase text-xs"
                >
                    lotto
                </label>
                <input
                    disabled
                    autoComplete="off"
                    name="lotto"
                    value={work?.cd_lotto}
                    id="lotto"
                    type={"text"}
                    className={
                        "placeholder:text-slate-500 placeholder:capitalize text-sm ring-1 mt-1 focus:outline-none ring-slate-300 rounded-full px-4 leading-9"
                    }
                ></input>
            </div>
            <div className="w-full flex flex-col gap-1">
                <label
                    htmlFor="art"
                    className="text-slate-500 uppercase text-xs"
                >
                    articolo
                </label>
                <input
                    disabled
                    autoComplete="off"
                    name="art"
                    value={work?.cd_ar}
                    id="art"
                    type={"text"}
                    className={
                        "placeholder:text-slate-500 placeholder:capitalize text-sm ring-1 mt-1 focus:outline-none ring-slate-300 rounded-full px-4 leading-9"
                    }
                ></input>
            </div>
            {work?.status === "done" && (
                <div className="w-full flex flex-col gap-1">
                    <label
                        htmlFor="basil_amount"
                        className="text-slate-500 uppercase text-xs"
                    >
                        quantità lavorata
                    </label>
                    <input
                        disabled
                        autoComplete="off"
                        name="basil_amount"
                        value={work?.basil_amount}
                        id="basil_amount"
                        type={"text"}
                        className={
                            "placeholder:text-slate-500 placeholder:capitalize text-sm ring-1 mt-1 focus:outline-none ring-slate-300 rounded-full px-4 leading-9"
                        }
                    ></input>
                </div>
            )}
            {work?.status === "done" && (
                <div className="w-full flex flex-col gap-1">
                    <label
                        htmlFor="packages"
                        className="text-slate-500 uppercase text-xs"
                    >
                        numero di imballi
                    </label>
                    <input
                        disabled
                        autoComplete="off"
                        name="packages"
                        value={work?.packages}
                        id="packages"
                        type={"text"}
                        className={
                            "placeholder:text-slate-500 placeholder:capitalize text-sm ring-1 mt-1 focus:outline-none ring-slate-300 rounded-full px-4 leading-9"
                        }
                    ></input>
                </div>
            )}
            <div className="flex items-center justify-end mt-2">
                {!work?.document_created && <button
                    onClick={deleteWorkHandler}
                    className={`bg-red-200 hover:bg-red-300 active:bg-red-400 focus:bg-red-300 transition-colors duration-200 ease-in-out uppercase py-2 text-sm px-3 rounded-full`}
                >
                    elimina
                </button>
                }
            </div>
        </Dialog>
    );
};

export default DetailProcessingDialog;
