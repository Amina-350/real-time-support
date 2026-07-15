import { useEffect, useState } from "react";
import MetricCard from "../MetricCard/MetricCard";
import "./AnalyticsOverview.css";
import api from "../../../config/axios";

function AnalyticsOverview() {
  const [totalresolved,settotalresolved]=useState();
useEffect(()=>{
    const getresolvedtickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/ticket/getresolvedtickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        settotalresolved(res.data.totalResolved);
      } catch(error) {
        alert("the error is ",error)
      }
    };
    getresolvedtickets();
  
},[])
console.log("totalresolved",totalresolved)


  return (
    <section className="analytics">
      <h2>ANALYTICS OVERVIEW</h2>

      <div className="metrics-grid">
     
          <MetricCard totalresolved={totalresolved} />
    
      </div>
    </section>
  );
}

export default AnalyticsOverview;