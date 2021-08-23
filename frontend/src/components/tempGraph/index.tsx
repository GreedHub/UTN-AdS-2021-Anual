import React from "react";
import {AreaChart,XAxis,YAxis,CartesianGrid,Tooltip,Area, ResponsiveContainer} from 'recharts';
import { Reading } from "../../types";
import './tempGraph.scss'

type TempGraphProps = {
  data:Reading[];
  deviceName:string;
}

export default function TempGraph(props:TempGraphProps){
  const { data,deviceName} = props;

    return(
        <div className="TempGraph">
            <h3>{deviceName.replace("_"," ")}</h3>
            <ResponsiveContainer width="95%" height={290}>
              <AreaChart data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="value" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EB4887" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EB4887" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp"/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#EB4887" fillOpacity={1} fill="url(#value)" />
              </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}