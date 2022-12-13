import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './main.module.css'
import constants from '../constants'
import { SecToSecMin } from '../services/utils'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
function Table() {
    const [pageLoading, setpageLoading] = useState(false)
    const [totalItems, settotalItems] = useState()
    const itemsPerPage = 10
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const navigate = useNavigate()
    const [callsRefresh, setcallsRefresh] = useState(false)
    const [modelState, setmodelState] = useState(false)
    const [modelData, setmodelData] = useState(null)
    const OpenNoteModel = (call) => {
        setmodelState(true)
        setmodelData(call)

    }
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % totalItems;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };
    const [calls, setCalls] = useState([])
    useEffect(() => {
        setpageLoading(true)
        const token = localStorage.getItem("AccessToken")
        const refresh_token = localStorage.getItem("RefreshToken")
        axios.get(`${constants.BASE_API_URL}/calls?offset=${itemOffset}&limit=10`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res)
            setCalls(res.data.nodes)
            settotalItems(res.data.totalCount)
            setpageLoading(false)
        }).catch(error => {
            setpageLoading(false)
            if (error.response.data.statusCode == '401') {
                alert("please Login Again,Token Expired")
                navigate("/")

            }
            console.log(error)
        })
    }, [callsRefresh, itemOffset])
    return (
        <div className="table-responsive">
            {/* <PaginatedItems itemsPerPage={4} />, */}
            <NoteModal state={modelState} data={modelData} setState={setmodelState} setcallsRefresh={setcallsRefresh} />
            <table className='table'>
                <thead>
                    <tr className='th-row'>
                        <th>Call Type</th>
                        <th>Direction</th>
                        <th>Duration</th>
                        <th>From</th>
                        <th>To</th>
                        <th>VIA</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {
                    pageLoading ? <h1>Loading data</h1> : <tbody>
                        {
                            calls.length && calls.map(call => {
                                const create_at = new Date(call.created_at)
                                const duration = SecToSecMin(call.duration)
                                return <tr >
                                    {
                                        (call.call_type == 'answered') ? <td className='text-primary'>{call.call_type}</td> : (call.call_type == 'missed') ? <td className='text-danger'>{call.call_type}</td> : <td className=''>{call.call_type}</td>
                                    }
                                    <td>{call.direction}</td>
                                    <td>{duration}</td>
                                    <td>{call.from}</td>
                                    <td>{call.to}</td>
                                    <td>{call.via}</td>
                                    <td>{Intl.DateTimeFormat('en-US').format(create_at)}</td>
                                    {
                                        (call.is_archived == true) ? <td>Archived</td> : <td>Not Archived</td>
                                    }
                                    <td> <button onClick={() => OpenNoteModel(call)} className={`${styles.add_note_button} bg-primary text-white`}>Add Note</button> </td>
                                </tr>
                            })
                        }


                    </tbody>
                }


            </table>
            <div className='pagination'><ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
            />


            </div>

        </div>

    )
}
export default Table
const NoteModal = ({ data: call, state, setState, setcallsRefresh }) => {
    const [addNoteLoading, setaddNoteLoading] = useState(false)
    const [notereponseError, setnotereponseError] = useState("")
    const [note, setnote] = useState("")
    const addNote = () => {
        setaddNoteLoading(true)
        const access_token = localStorage.getItem("AccessToken")
        axios.post(`${constants.BASE_API_URL}/calls/${call.id}/note`, {
            content: note
        }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(res => {
            setaddNoteLoading(false)
            setnote("")
            setcallsRefresh(pre => {
                return !pre
            })
            setState(false)

        }).catch(error => {
            if (error.response.data.statusCode == '401') {
                alert("please Login Again,Token Expired")
                navigate("/")

            }
            else {
                setnotereponseError(error.response.data.message)
                setaddNoteLoading(false)
                setTimeout(() => {
                    setnotereponseError("")
                }, 3000)
            }

        }).finally(() => {

        })
    }
    if (state) {
        return <div className="card note-model">
            <div className="card-body d-flex flex-column">
                <h5>
                    Call Details:
                </h5>

                <p className='mb-0 text-primary'>
                    call id: {call.id}
                </p>
                <div className='flex-grow-1'>
                    Notes:
                    {
                        call.notes.length && call.notes.map(note => {
                            return < li className='mb-0 border-bottom' >
                                {note.content}
                            </li>
                        })
                    }
                </div>
                <input value={note} onChange={(e) => {
                    setnote(e.target.value)
                }} type="text" />
                {
                    addNoteLoading == true ? <h4>Adding Note,please wait</h4> : (notereponseError !== "") ? <p className='text-danger'>{notereponseError}</p> : <>
                        <button onClick={addNote} className={`${styles.add_note_button} bg-success my-3`}>Add note</button>
                        <button onClick={() => setState(false)} className={`${styles.add_note_button} my-3`}>Cancel</button>
                    </>
                }

            </div>
        </div >
    }
    else
        return null
}