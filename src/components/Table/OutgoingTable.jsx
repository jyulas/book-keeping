import React, { useEffect, useState } from "react";
import OutgoingTableRow from "./OutgoingTableRow";
import dayjs from "dayjs";
import TableHeading from "./TableHeading";
import Pagination from "../Pagination/Pagination";
import { collection, getDocs, limit, limitToLast, orderBy, query, startAfter, endBefore, startAt, writeBatch, where, doc} from "firebase/firestore";
import { db } from "../../utils/Firebase";
import { useAuth } from "../../hooks/useAuth";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import FilterDropdown from "../Button/FilterDropdown";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import NoDataFound from "../../pages/Error/NoDataFound";
import FilterTableLimit from "../Button/FilterTableLimit";

function OutgoingTable() {
    const notify = () => toast.warning("No more documents to show", {
        position: "top-center",
        autoClose: 3000, // auto close after 5 seconds
        onClose: () => {
            setTimeout(() => {
            window.location.reload(); // reload window after toast is closed
            }, 3000);
        },

    });
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const titleTable = [
        "DocID",
        "Recipient",
        "File",
        "Date Sent",
        "Action",

        
        
    ]
    // const getAllRequestDocumments = async () => {
    //     const snapshot = await getDocs(collection(db, "incoming"));
    //     if (user) {
    //         setData(snapshot.docs.map((doc) => doc.data()).filter((item) => item.sentby === user.email));
    //     }
        

    //     console.log(data);
    // }
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);

  
        
        
    const fetchData = async () => {
        const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(5));
        if (user) {
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                    
                    
            });
            setList(items.filter((item) => item.sentby === user.email));
            if (items.filter((item) => item.sentby === user.email).length === 0) {
                document.getElementById("audit-table").hidden = true;
            }
            else {
                document.getElementById("audit-table").hidden = false;
            }
            
            
        }
        
    };

    

    const showNextPage = ({item}) => {
        if (list.length === 0) {
            notify();
            
        }
        else {
            const fetchNextData = async () => {
                const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(5), startAfter(item.date));
                if (user) {
                    const querySnapshot = await getDocs(q)
                    const items = []
                    querySnapshot.forEach((doc) => {
                        items.push(doc.data())
        
                    });
                    setList(items.filter((item) => item.sentby === user.email));
                    setPage(page + 1);
                    console.log(items);
                }
               
            };
            fetchNextData();
        }
    }

    const showPrevPage = ({item}) => {
        if (list.length === 0) {
            notify();
           
        }
        else {
        const fetchPrevData = async () => {
            const q = query(collection(db, "incoming"),orderBy("date", "desc"),endBefore(item.date), limitToLast(5) );
            if (user) {
                const querySnapshot = await getDocs(q)
                const items = []
                querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                });
                setList(items.filter((item) => item.sentby === user.email));
                console.log();
                setPage(page - 1);
                console.log(items);
            }
        };
        fetchPrevData();
    }
    }
    const filterExcel = () => {
        if (list.length === 0) {
            notify();
           
        }
        else {

        const fetchPrevData = async () => {
            const q = query(collection(db, "incoming"),orderBy("date", "desc"));
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                items.push(doc.data())
                
            });
            setList(items.filter((item) => item.file.includes(".xlsx") && item.email === user.email));
            document.getElementById("audit-table").hidden = true;
            console.log(list.filter((item) => item.file.includes(".xlsx")));
                
        };
        fetchPrevData();


        }
    }
    const filterPdf = () => {
        if (list.length === 0) {
            notify();
            
        }
        else {

        const fetchPrevData = async () => {
            const q = query(collection(db, "incoming"),orderBy("date", "desc"));
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                items.push(doc.data())
                
            });
            setList(items.filter((item) => item.file.includes(".pdf") && item.email === user.email));
            document.getElementById("audit-table").hidden = true;
            console.log(list.filter((item) => item.file.includes(".pdf")));
                
        };
        fetchPrevData();


        }
    }
    const getLastlogin = async (email) => {
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q)
        const items = []
        querySnapshot.forEach((doc) => {
            items.push(doc.data())
            
        }
        );
        // console.log(items[0].Llogin);
        return items[0].Llogin;

    };

    const checkFileExpire = async () => {
        const lastlogin = await getLastlogin(user.email);
        const batch = writeBatch(db);
        const q = query(collection(db, "incoming"), where("sentby", "==", user.email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents.");
        }
        else {
            const docRef = doc(db, "archive", querySnapshot.docs[0].id);
            for (let i = 0; i < querySnapshot.docs.length; i++) {
                const doc = querySnapshot.docs[i];
                const data = doc.data(); 
                if (lastlogin > data.fileexpiry) {
                    batch.set(docRef, data);
                    batch.delete(doc.ref);
                    await batch.commit();
                }
            }
        } 
    }

    const fetchFiveData = async () => {
        const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(5));
        if (user) {
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                    
                    
            });
            setList(items.filter((item) => item.sentby === user.email));
            if (items.filter((item) => item.sentby === user.email).length === 0) {
                document.getElementById("audit-table").hidden = true;
            }
            else {
                document.getElementById("audit-table").hidden = true;
            }
            
            
        }
            
    };
    


    const fetchTenData = async () => {
        const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(10));
        if (user) {
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                    
                    
            });
            setList(items.filter((item) => item.sentby === user.email));
            if (items.filter((item) => item.sentby === user.email).length === 0) {
                document.getElementById("audit-table").hidden = true;
            }
            else {
                document.getElementById("audit-table").hidden = true;
            }
            
            
        }
        
    };
    const fetchFifteenData = async () => {
        const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(15));
        if (user) {
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                    
                    
            });
            setList(items.filter((item) => item.sentby === user.email));
            if (items.filter((item) => item.sentby === user.email).length === 0) {
                document.getElementById("audit-table").hidden = true;
            }
            else {
                document.getElementById("audit-table").hidden = true;
            }
            
            
        }
        
    };
    const fetchTwentyData = async () => {
        const q = query(collection(db, "incoming"),orderBy("date", "desc"), limit(20));
        if (user) {
            const querySnapshot = await getDocs(q)
            const items = []
            querySnapshot.forEach((doc) => {
                    items.push(doc.data())
                    
                    
            });
            setList(items.filter((item) => item.sentby === user.email));
            if (items.filter((item) => item.sentby === user.email).length === 0) {
                document.getElementById("audit-table").hidden = true;
            }
            else {
                document.getElementById("audit-table").hidden = true;
            }
            
            
        }
        
    };
    


    useEffect(() => {
        fetchData();
        if (list.length === 0) {
            document.getElementById("audit-table").hidden = true;
        }
        const interval = setInterval(async () => {
            // await fetchData();
            await checkFileExpire();

        }, 5000)
        return () => {
            clearInterval(interval); // need to clear the interval when the component unmounts to prevent memory leaks
        };
    }, []);


    return (
        <>
            <ToastContainer />
            <div className={"flex flex-row px-7 pt-7 mt-4 text-sm font-medium tracking-wide"}> 
                <div>
                    Show <FilterTableLimit 
                        limit5={fetchFiveData}
                        limit10={fetchTenData}
                        limit15={fetchFifteenData}
                        limit20={fetchTwentyData}
                    /> results
                </div>

                <div className={"ml-4"}>
                    Filter by Type <FilterDropdown 
                        excel={filterExcel}
                        pdf={filterPdf}
                        all={fetchData}
                    />
                </div>
            
            </div>   
            <div className={"mt-4 mx-4"}>
                <div className={"w-full overflow-hidden rounded-lg shadow-xs"}>
                    <div className={"w-full overflow-x-auto"}>
                        <table className={"w-full"}>
                            <thead>
                                <tr className={" text-sm font-bold font-inter tracking-wide text-left " + 
                                " text-gray-500 border-b border-gray-700 " +
                                " bg-gray-100 dark:text-gray-400 "}>
                                    {titleTable.map((item) => (
                                        <TableHeading
                                            text={item}
                                        />

                                    ))}
                                </tr>
                            </thead>
                            <tbody className={"font-inter divide-y"}>
                                {list.length === 0 ? ( 
                                    <tr className={"text-sm font-medium text-center text-gray-900 "}>
                                        <td colSpan={5} className={"pt-10"}>
                                            <NoDataFound
                                                text={"No Data"}
                                            />
                                        </td>
                                    </tr>
                                ) : null
                                }
                                {list.map?.((item) => (
                                    <OutgoingTableRow
                                        Column1={item.docid}
                                        Column2={item.email}
                                        Column3={item.filename}
                                        Column4={dayjs.unix(item.date?.seconds).format("hh:mm:ss A, DD/MM/YYYY")}
                                        
                                    />)
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div id = "audit-table" >
                        <Pagination 
                            path={showPrevPage}
                            item={showNextPage}
                            list={list}
                            page={page}
                            
                        />
                    </div>     
                </div>
            </div>
        </>
    )
}

export default OutgoingTable;
