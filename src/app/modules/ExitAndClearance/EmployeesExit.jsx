// import React from "react";

// import { connect } from "react-redux";
// import { useEffect, useState } from "react";
// import "react-toastify/dist/ReactToastify.css";
// import { Header, PageLoader } from "components";
// import ExitRequestForm from "./ExitRequestForm";
// import { getEmployeeExitDataById } from "app/hooks/employee";
// import ExitRequestDetails from "./ExitRequestDetails";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "src/@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardHeader,
// } from "../../../components/ui/card.jsx";

// const EmployeeExit = ({ userProfile, userDetails }) => {
//   const [activeTab, setActiveTab] = useState("exitRequest");
//   const [resignation, setResignation] = useState({});
//   const [termination, setTermination] = useState({});
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await getEmployeeExitDataById(userProfile.id);
//       if (response) {
//         const data = response?.data.results.result;
//         const resignations = data.filter(
//           (item) => item.exit_category === "resignation"
//         );
//         const terminations = data.filter(
//           (item) => item.exit_category === "termination"
//         );

//         setResignation(resignations[0]);
//         setTermination(terminations[0]);
//       }
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [userProfile]);


//     const tabsData = [
//       { value: "exitRequest", label: "Exit Request" },
//       { value: "terminationLetter", label: "Termination Letter" },
//     ];


//   return (
//     <div className="screen bg-[#F0F1F2]">
//       {/* <Header title="Employee Offboarding" /> */}
//       dsfsdf
//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         defaultValue="exitRequest"
//       >
//         {userProfile.role !== 2 ? (
//           <TabsList className="flex justify-center mb-4">
//             {tabsData?.map((tab) => (
//               <TabsTrigger
//                 key={tab.value}
//                 value={tab.value}
//                 className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
//               >
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         ) : (
//           <div></div>
//         )}

//         <Card>
//           <CardContent>
//             <TabsContent value="exitRequest">
//               {loading ? (
//                 <PageLoader />
//               ) : (
//                 "exit request"
//               )}
//             </TabsContent>
//             <TabsContent value="termination">
//               {loading ? (
//                 <PageLoader />
//               ) : (
//                 "termination"
//               )}
//             </TabsContent>
//           </CardContent>
//         </Card>
//       </Tabs>
//       {/* <Row className="bg-[#F0F1F2] relative">
//         <Col lg={12}>
//           <div className="m-2 mb-0 0">
//             <Tabs
//               tabs={["Exit Request", "Termination Letter"]}
//               onTabChange={(value) => {
//                 setActiveTab(value);
//               }}
//             />
//           </div>
//         </Col>
//         {loading ? (
//           <PageLoader />
//         ) : (
//           <Col lg={12}>
//             <>
//               {activeTab === "Exit Request" && resignation ? (
//                 <ExitRequestDetails
//                   userDetails={userDetails}
//                   exitData={resignation}
//                   isTermination={false}
//                 />
//               ) : activeTab === "Exit Request" ? (
//                 <ExitRequestForm userProfile={userProfile} reload={fetchData} />
//               ) : termination ? (
//                 <ExitRequestDetails
//                   userDetails={userDetails}
//                   exitData={termination}
//                   isTermination={true}
//                 />
//               ) : (
//                 <div className="w-full h-96 bg-white flex items-center justify-center text-3xl text-gray-600">
//                   <div>No Termination Letter</div>
//                 </div>
//               )}
//             </>
//           </Col>
//         )}
//         <br />
//       </Row> */}
//     </div>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     token: state.user.token,
//     userProfile: state.user.userProfile,
//     userDetails: state.emp.userDetails,
//   };
// };

// export default connect(mapStateToProps)(EmployeeExit);
