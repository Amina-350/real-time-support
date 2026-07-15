import "./MetricCard.css";

function MetricCard({ totalresolved}) {
  return (
    <>
   
    <div className="metric-card">
      <h4>Total Resolved Tickets</h4>
      <p>{totalresolved}</p>
    </div>
     {/* <div className="metric-card">
      <h4>Total Resolved Tickets</h4>
      <p>{totalresolved}</p>
    </div> */}
     </>
  );
}

export default MetricCard;