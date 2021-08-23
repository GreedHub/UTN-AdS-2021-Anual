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

  const parseStatus = (status:string)=>{
    return status.replace('good','Saludable')
                 .replace('alerted','Alerta')
                 .replace('alarmed','Crítico')
  }

    return(
        <div className="StatusGraph">
            <h3>Estado del sistema: <span className={status}>{parseStatus(status)}</span></h3>
            
        </div>
    )
}