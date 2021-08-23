import React from "react";
import {AreaChart,XAxis,YAxis,CartesianGrid,Tooltip,Area} from 'recharts';
import { Reading } from "../../types";
import './statusGraph.scss'

type StatusGraphProps = {
  status:string;
}

let posibleStatus = [
  "good",
  "alerted",
  "alarmed",
];

export default function StatusGraph(props:StatusGraphProps){
  const { status } = props;

    return(
        <div className="StatusGraph">
            <h3>System Status: <span className={status}>{status}</span></h3>
            
        </div>
    )
}