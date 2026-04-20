import React from "react";
import DashboardButton from "./DashboardButton";

const DashboardLayout = ({ role }) => {
    const renderButtons = () => {
        switch(role) {
            case "Student":
                return (
                    <>
                        <DashboardButton label = "Submit Weekly Report" onClick={()=>{}}/>
                        <DashboardButton label = "View Reports" onClick={()=>{}}/>
                        <DashboardButton label = "heck Feedback" onClick={()=>{}}/>
                        <DashboardButton label = "Profile and Internship Info" onClick={()=>{}}/>
                    </>
                );
            case "Workplace Supervisor":
            case "Academic Supervisor":
                return (
                    <>
                        <DashboardButton label = "Review Reports" onClick={()=>{}}/>
                        <DashboardButton label = "Provde Feedback" onClick={()=>{}}/>
                        <DashboardButton label = "Student List" onClick={()=>{}}/>
                        <DashboardButton label = "Profile Settings" onClick={()=>{}}/>
                    </>
                );
            default:
                return (<p>Invalid role</p>);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>{role} Dashboard </h2>
            <div className="dashboard-buttons">
                {renderButtons()}
            </div>
        </div>
    );
};

export default DashboardLayout;