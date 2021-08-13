import React, { useEffect, useState } from "react";
import { PromiseHandler, time } from "../../../helpers";
import { device as deviceService } from "../../../services";
import { Reading } from "../../../types";
import TempGraph from "../../tempGraph";
import './content.scss';

export default function Content(){

    const [tempDevice,setTempDevice] = useState<{readings:Reading[],name:string}>({readings:[],name:""});

    const loadDeviceData = async()=>{
        let [_tempDevice,err] = await PromiseHandler(deviceService.getDeviceReadings(
            "TEMP_SENSOR"
        ));
        if(err){
            console.error(err);
            return
        }

        _tempDevice.readings = _tempDevice.readings.map((reading:Reading)=>{
            reading["timestamp"] = time.toLocalTime(reading.timestamp);
            return reading;
        })

        setTempDevice(_tempDevice);

    }

    useEffect(()=>{
        loadDeviceData();
    },[])

    return(
        <div className="Content">
            <TempGraph data={tempDevice.readings} deviceName={`${tempDevice.readings.pop()?.name}`}/>
        </div>
    )
}